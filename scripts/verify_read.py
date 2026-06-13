from gl import make_client, read

ADDR = "0x205651dEfaB269eDa5B1880E0a96f1C8aE777d6F"
client, account = make_client()

print("get_stats ->", read(client, account, ADDR, "get_stats"))
print("get_cases(0) ->", read(client, account, ADDR, "get_cases", [0]))
