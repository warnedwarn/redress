from gltest import get_contract_factory, create_account
from gltest.assertions import tx_execution_succeeded


def test_file_and_rule_flow():
    factory = get_contract_factory("Redress")
    contract = factory.deploy(args=[])

    stats = contract.get_stats(args=[]).call()
    assert stats["cases"] == 0
    assert stats["ruled"] == 0

    # File a grievance (deterministic write, no AI)
    open_receipt = contract.file_grievance(args=[
        "Unfinished kitchen renovation",
        "Refund of the final 30 percent payment",
        "I paid a contractor in full to renovate my kitchen by March 1. The cabinets were never "
        "installed and the contractor stopped responding after the final payment cleared. I am "
        "seeking a refund of the last installment for work that was never delivered.",
    ]).transact()
    assert tx_execution_succeeded(open_receipt)

    cases = contract.get_cases(args=[0]).call()
    assert len(cases) == 1
    cid = cases[0]["id"]
    assert cases[0]["status"] == "OPEN"

    # File a defense from a DIFFERENT account (respondent != claimant)
    respondent = create_account()
    defense_receipt = contract.connect(respondent).file_defense(args=[
        cid,
        "The cabinets were custom-ordered and delayed by the supplier, not by me. I completed all "
        "plumbing and electrical work on schedule and offered to install the cabinets as soon as "
        "they arrive. The final payment covered materials already purchased and non-refundable.",
    ]).transact()
    assert tx_execution_succeeded(defense_receipt)

    ruled = contract.get_case(args=[cid]).call()
    assert ruled["status"] == "RULED"
    assert ruled["ruling"] in ("UPHELD", "DISMISSED", "SPLIT")
    assert 0 <= ruled["fault"] <= 100
    if ruled["ruling"] == "UPHELD":
        assert ruled["fault"] >= 65
    elif ruled["ruling"] == "SPLIT":
        assert 35 <= ruled["fault"] <= 64
    else:
        assert ruled["fault"] <= 34


def test_guard_rejects_empty_title():
    factory = get_contract_factory("Redress")
    contract = factory.deploy(args=[])
    receipt = contract.file_grievance(args=["", "some remedy", "some grievance text"]).transact()
    assert not tx_execution_succeeded(receipt)
