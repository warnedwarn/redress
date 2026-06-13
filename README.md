_In the matter of_

# Redress

### an on-chain small-claims court

There is no judge on a payroll here. A claimant files a grievance and names the remedy they want. The other party answers, and that answer is what convenes the court: an AI magistrate weighs both sides and rules **UPHELD**, **SPLIT**, or **DISMISSED**, assigning a fault score to the respondent. The ruling is not one machine's opinion in a database. Every GenLayer validator re-hears the case and they must agree before the judgment is entered on the docket. No deposits, no custody, only network fees.

> Live court: https://warnedwarn.github.io/redress/
> Contract of record: [0x205651dEfaB269eDa5B1880E0a96f1C8aE777d6F](https://explorer-bradbury.genlayer.com/address/0x205651dEfaB269eDa5B1880E0a96f1C8aE777d6F) on GenLayer Bradbury
> Empaneled by tx [0x45a24c4d...46d08](https://explorer-bradbury.genlayer.com/tx/0x45a24c4dc08acd41f7323a32ab392e02f792abab5b559e36ccdec511b5446d08)

---

### Why this belongs on a chain

Any single server that resolves disputes is just an unaccountable referee. The point of Redress is that the verdict is reproducible and adversarial: many validators run the same magistrate over the same two filings and have to land on the same ruling, or nothing is recorded. That is the part GenLayer makes possible and an ordinary backend cannot. There is no backend to speak of, the contract holds every case, both parties' filings, the verdict, the fault score, and the docket log under consensus. The site is a static reading room over that record.

### The rule that shapes everything: two real sides

Most on-chain AI apps judge one submission from one person. Redress needs two. A grievance alone does nothing; filing the **defense** is the act that triggers the hearing. And the contract refuses a defense from the claimant's own address, so a case is never decided on one voice. This is enforced in code, not merely asked for in the prompt.

### Order of proceedings

1. **The complaint.** `file_grievance(title, remedy, grievance)` opens a case on the public docket. Deterministic, no AI, cheap. It validates lengths and records the claimant.
2. **The answer.** A different wallet calls `file_defense(case_id, defense)`. The contract rejects an empty or oversized answer, a case that is already ruled, and crucially an answer from the claimant.
3. **The hearing.** Inside `_adjudicate`, an injection-resistant prompt presents the title, remedy, grievance, and defense as untrusted data. The magistrate returns `{ruling, fault, opinion}`. Fault is the share assigned to the respondent: UPHELD sits high (65-100), SPLIT in the middle (35-64), DISMISSED low (0-34).
4. **The panel.** A custom validator (`gl.vm.run_nondet_unsafe`) has every validator re-run the hearing. The ruling word must match exactly; the fault score must agree within tolerance (the larger of 20 points or 20 percent). Disagreement rotates the leader. Errors are classified so even failures reach consensus.
5. **The judgment.** A deterministic backstop clamps the fault into the band its ruling requires, then the case flips to RULED and the verdict is appended to the docket for good.

### The record, in storage

Cases are JSON in a `TreeMap[str, str]` keyed by id, with a `DynArray[str]` of ids for ordered paging and `u256` tallies (`total_cases`, `total_ruled`, `total_upheld`) so statistics never scan. Runner pinned to `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`.

Public methods of record:

- `file_grievance(title, remedy, grievance) -> id` , opens a case (deterministic)
- `file_defense(case_id, defense)` , answers and triggers the AI hearing (the consensus write)
- `get_cases(start)` , paged docket, 20 at a time
- `get_case(case_id)` , one case in full
- `get_docket(start)` , the append-only event log
- `get_stats()` , running tallies

### The reading room (frontend)

Next.js 14 exported to static HTML, TypeScript, Tailwind, Framer Motion, lucide icons, genlayer-js 1.1.8.

The look is editorial magazine: a warm near-black page, a muted terracotta accent, a Newsreader serif masthead set in italic over Work Sans body, ruled hairlines, small-caps kickers, oversized serif numerals as step markers, and a drifting halftone-dot field behind the masthead. Two-column asymmetric feature rows carry the procedure. It is meant to read like a printed law report, unlike anything else in the registry.

Notes on conduct:
- Reading needs no wallet; the docket renders on load, wrapped so a failed RPC degrades one section rather than the page.
- One modal serves both filings: opening a grievance (deterministic, fast) and answering one (the AI write). The answer flow stages the real hearing lifecycle and previews the magistrate's draft ruling decoded from the receipt, marked as a draft until entered.
- The two-party rule is surfaced in the UI: the defense form reminds you to answer from a wallet other than the claimant's, and a claimant-self-answer error maps to a plain message.
- Status polling uses `gen_getTransactionByHash` (no VM execution, dodges the read rate limit); docket polling is slow and pauses while a write is in flight. Leader rotation reads as "still in session," never an error.

### Holding session locally

```bash
# the contract
pip install genvm-linter genlayer-test
genvm-lint check contracts/contract.py
gltest tests/integration/ -v -s --network studionet

# the reading room
cd frontend && npm install
npm run dev      # localhost:3000
npm run build    # static export into frontend/out
```

Deployment signs with the key in a repo-root `.env` (template in `.env.example`), not the CLI keychain. Because the defense must come from a second party, `verify_write.py` funds a fresh respondent from the deployer before filing the answer:

```bash
python scripts/deploy.py        # deploy and verify the receipt
python scripts/verify_read.py   # read gate
python scripts/verify_write.py  # file grievance, fund respondent, AI defense, end to end
```

Ship the reading room to GitHub Pages from `frontend/`:

```bash
npm run deploy   # builds, pushes out/ to gh-pages with --dotfiles
```

### Citations

| | |
| --- | --- |
| Court | https://warnedwarn.github.io/redress/ |
| Contract | https://explorer-bradbury.genlayer.com/address/0x205651dEfaB269eDa5B1880E0a96f1C8aE777d6F |
| Empaneling tx | https://explorer-bradbury.genlayer.com/tx/0x45a24c4dc08acd41f7323a32ab392e02f792abab5b559e36ccdec511b5446d08 |
| Test GEN | https://testnet-faucet.genlayer.foundation/ |

The magistrate is an AI ruling under validator consensus on a test network. Redress is not a court of law and nothing here is legal advice.
