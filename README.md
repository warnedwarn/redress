```
================================================================
  R E D R E S S            on-chain small-claims court
  Docket of record . GenLayer Bradbury Testnet . Chain 4221
================================================================
```

**Redress, No. 001** , a court with no judge on a payroll. A claimant files a grievance and names the remedy they want. The other side answers, and that answer convenes the bench: an AI magistrate weighs both filings and enters **UPHELD**, **SPLIT**, or **DISMISSED** with a fault score against the respondent. The verdict is not one machine's private call, every GenLayer validator re-hears the case and they must agree before it is entered on the docket. No deposits, no custody, network fees only.

Sitting now at **[warnedwarn.github.io/redress](https://warnedwarn.github.io/redress/)** , contract **[0x205651dE…777d6F](https://explorer-bradbury.genlayer.com/address/0x205651dEfaB269eDa5B1880E0a96f1C8aE777d6F)** , empaneled by tx **[0x45a24c4d…46d08](https://explorer-bradbury.genlayer.com/tx/0x45a24c4dc08acd41f7323a32ab392e02f792abab5b559e36ccdec511b5446d08)**.

---

### Art. 1 , Jurisdiction (why a chain hears this)

A lone server that resolves disputes is an unaccountable referee. Redress moves the verdict under consensus: many validators run the same magistrate over the same two filings and must reach the same ruling, or nothing is recorded. That reproducible, adversarial judgment over subjective evidence is the thing GenLayer makes possible and a plain backend cannot. There is no backend, the contract is the court of record. It holds every case, both parties' words, the verdict, the fault score, and the docket log. The website is a static gallery onto that record; close it and the court still sits.

### Art. 2 , Standing requires two parties

This is the clause that shapes the whole design, and the reason Redress is not just another single-submission judge. A grievance alone does nothing. Filing the **defense** is the act that opens the hearing, and the contract refuses a defense from the claimant's own address. A case is therefore never decided on one voice, and that requirement lives in code (`file_defense` rejects `respondent == claimant`), not in a polite prompt instruction.

### Art. 3 , Order of proceedings

> **i.** `file_grievance(title, remedy, grievance)` opens a case on the public docket. Deterministic, cheap, no AI. Lengths are validated; the claimant is recorded.
>
> **ii.** A different wallet calls `file_defense(case_id, defense)`. Rejected if empty, oversized, already ruled, or filed by the claimant.
>
> **iii.** `_adjudicate` presents title, remedy, grievance, and defense to an injection-resistant prompt as untrusted data. The magistrate returns `{ruling, fault, opinion}`; fault is the respondent's share , UPHELD 65-100, SPLIT 35-64, DISMISSED 0-34.
>
> **iv.** A custom validator (`gl.vm.run_nondet_unsafe`) has every validator re-hear the case. The ruling word must match exactly; the fault must agree within tolerance (max of 20 points or 20 percent). Disagreement rotates the leader. Error classes are compared so even failures reach consensus.
>
> **v.** A deterministic backstop clamps fault into its ruling's band, the case flips to RULED, and the verdict is appended to the docket for good.

### Art. 4 , The record (storage and surface)

Cases are JSON in `TreeMap[str, str]` keyed by id, with a `DynArray[str]` of ids for ordered paging and `u256` tallies (`total_cases`, `total_ruled`, `total_upheld`) so statistics never scan. Runner pinned to `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`. The clerk answers four reads , `get_cases(start)`, `get_case(id)`, `get_docket(start)`, `get_stats()` , each paged at twenty.

### Art. 5 , The gallery (frontend)

Next.js 14 static export, TypeScript, Tailwind, Framer Motion, lucide icons, genlayer-js 1.1.8. Dressed as a printed law report: warm near-black stock, muted terracotta, a Newsreader serif masthead in italic over Work Sans, ruled hairlines, small-caps kickers, oversized serif numerals, a drifting halftone field, and asymmetric two-column rows. Reads need no wallet and render on load behind an error boundary. One modal serves both filings and stages the real hearing lifecycle, previewing the magistrate's draft ruling decoded from the receipt until it is entered. Transaction status is polled via `gen_getTransactionByHash` (no VM execution, no read-limit hit); docket polling is slow and pauses during a write. Leader rotation reads as "still in session," never an error.

---

```
CLERK'S NOTES , running the court locally
------------------------------------------------------------
contract   pip install genvm-linter genlayer-test
           genvm-lint check contracts/contract.py
           gltest tests/integration/ -v -s --network studionet
gallery    cd frontend && npm install && npm run dev
deploy     python scripts/deploy.py        (signs with .env key, not the CLI)
           python scripts/verify_read.py
           python scripts/verify_write.py  (funds a 2nd wallet for the defense)
publish    cd frontend && npm run deploy   (out/ -> gh-pages, --dotfiles)
------------------------------------------------------------
```

Deployment signs with the key in a repo-root `.env` (see `.env.example`), never the CLI keychain. Because a defense must come from a second party, `verify_write.py` funds a fresh respondent from the deployer before filing the answer. Test GEN to file your own case: [testnet-faucet.genlayer.foundation](https://testnet-faucet.genlayer.foundation/).

_The magistrate is an AI ruling under validator consensus on a test network. Redress is not a court of law and nothing here is legal advice._
