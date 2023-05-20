import { Base58, MockVM, Arrays, Protobuf, authority, chain, System, system_calls, common } from "@koinos/sdk-as";
import { Gamestats } from "../Gamestats";
import { gamestats } from "../proto/gamestats";
import { LeaderboardStorage } from "../state/LeaderboardStorage";

const CONTRACT_ID = Base58.decode("1DQzuCcTKacbs9GGScRTU1Hc8BsyARTPqe");
const MOCK_ACCT1 = Base58.decode("19WxDJ9Kcvx4VqQFkpwVmwVEy1hMuwXtQE");
const MOCK_ACCT2 = Base58.decode("1HGN9h47CzoFwU2bQZwe6BYoX4TM6pXc4b");
const MOCK_ACCT3 = Base58.decode("15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL");

describe("gamestats", () => {
  beforeEach(() => {
    MockVM.reset();
    MockVM.setContractId(CONTRACT_ID);
    MockVM.setCaller(new chain.caller_data(new Uint8Array(0), chain.privilege.user_mode));
    MockVM.setHeadInfo(new chain.head_info(null, 123456789));
  });

  it("orders the leaderboard", () => {
    const leaderboard = new LeaderboardStorage(System.getContractId());

    leaderboard.put(
      new gamestats.leaderboard_key(1, MOCK_ACCT1),
      new gamestats.empty_message()
    );
 
    leaderboard.put(
      new gamestats.leaderboard_key(1000000, MOCK_ACCT3),
      new gamestats.empty_message()
    );

    leaderboard.put(
      new gamestats.leaderboard_key(10, MOCK_ACCT2),
      new gamestats.empty_message()
    );

    let key = new gamestats.leaderboard_key(u32.MAX_VALUE, new Uint8Array(25).fill(u8.MAX_VALUE));

    let obj: System.ProtoDatabaseObject<gamestats.empty_message> | null;
    let tmpKey: gamestats.leaderboard_key;

    let index = 0;
    do {
      obj = leaderboard.getPrev(key);

      if (obj) {
        tmpKey = Protobuf.decode<gamestats.leaderboard_key>(
          obj.key!,
          gamestats.leaderboard_key.decode
        );

        System.log(tmpKey.wins.toString() + ':' + Base58.encode(tmpKey.player));

        if (index == 0) {
          expect(tmpKey.wins).toStrictEqual(1000000);
          expect(Base58.encode(tmpKey.player)).toStrictEqual(Base58.encode(MOCK_ACCT3));
        } else if (index == 1) {
          expect(tmpKey.wins).toStrictEqual(10);
          expect(Base58.encode(tmpKey.player)).toStrictEqual(Base58.encode(MOCK_ACCT2));
        } else if (index == 2) {
          expect(tmpKey.wins).toStrictEqual(1);
          expect(Base58.encode(tmpKey.player)).toStrictEqual(Base58.encode(MOCK_ACCT1));
        }

        index++;
        key = tmpKey;
      }
    } while (obj != null);


  });
});
