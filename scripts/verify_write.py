import time
from gl import make_client, read
from genlayer_py import create_account, create_client
from genlayer_py.chains import testnet_bradbury
from genlayer_py.types import TransactionStatus

ADDR = "0x205651dEfaB269eDa5B1880E0a96f1C8aE777d6F"
client, account = make_client()


def native_transfer(to_addr: str, gen: float):
    nonce = client.get_transaction_count(account.address)
    gp = client.gas_price
    tx = {
        "to": to_addr,
        "value": int(gen * 10**18),
        "nonce": nonce,
        "chainId": client.chain.id,
        "gas": 30000,
        "maxFeePerGas": gp,
        "maxPriorityFeePerGas": gp,
    }
    signed = account.sign_transaction(tx)
    return client.send_raw_transaction(signed.raw_transaction)


print("Filing a grievance (claimant = .env account)...")
tx1 = client.write_contract(
    address=ADDR,
    function_name="file_grievance",
    args=[
        "Late freelance delivery dispute",
        "Refund of half the project fee",
        "I hired a freelancer to deliver a logo and brand kit by April 10. Only a rough draft "
        "arrived two weeks late and the brand kit was never sent. I am seeking a refund of half "
        "the fee for the undelivered work.",
    ],
)
print("grievance tx:", tx1)
client.wait_for_transaction_receipt(transaction_hash=tx1, status=TransactionStatus.ACCEPTED, interval=6000, retries=120)
cases = read(client, account, ADDR, "get_cases", [0])
cid = cases[-1]["id"]
print("case id:", cid)

respondent = create_account()
print("Funding respondent", respondent.address, "...")
native_transfer(respondent.address, 3)
for _ in range(30):
    time.sleep(5)
    bal = client.get_balance(respondent.address) / 10**18
    if bal > 0:
        break
print("respondent balance:", bal, "GEN")

rclient = create_client(chain=testnet_bradbury, account=respondent)
print("Filing defense (respondent, AI write under consensus)...")
tx2 = rclient.write_contract(
    address=ADDR,
    function_name="file_defense",
    args=[
        cid,
        "The delay was caused by the client repeatedly changing the brief after the deadline. The "
        "logo draft was delivered and revisions were offered at no cost; the brand kit was pending "
        "final logo sign-off, which the client never gave.",
    ],
)
print("defense tx:", tx2)
rclient.wait_for_transaction_receipt(transaction_hash=tx2, status=TransactionStatus.ACCEPTED, interval=8000, retries=120)
time.sleep(3)
print("stats:", read(client, account, ADDR, "get_stats"))
print("ruled case ->", read(client, account, ADDR, "get_case", [cid]))
