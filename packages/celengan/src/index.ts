import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBF2XQAEPAXQ5XX3T4HOFYGNQ37KP5CF5K2TQMF5DPLC6YLIWUMS77AX",
  }
} as const

export const Errors = {
  1: {message:"InvalidAmount"},
  2: {message:"InvalidSplit"},
  3: {message:"InsufficientSpend"},
  4: {message:"InsufficientShares"},
  5: {message:"SavingsLocked"},
  6: {message:"LockNotExtended"},
  7: {message:"EmptyWithdrawal"},
  8: {message:"LockTooLong"}
}


export interface Account {
  lock_until: u64;
  shares: i128;
  spend: i128;
  split_bps: u32;
}

export const OwnableError = {
  2100: {message:"OwnerNotSet"},
  2101: {message:"TransferInProgress"},
  2102: {message:"OwnerAlreadySet"}
}



export const PausableError = {
  /**
   * The operation failed because the contract is paused.
   */
  1000: {message:"EnforcedPause"},
  /**
   * The operation failed because the contract is not paused.
   */
  1001: {message:"ExpectedPause"}
}

export interface Client {
  /**
   * Construct and simulate a pay transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pays `to` through the splitter: the savings share of `amount` goes to
   * the vault, the rest is credited to the spendable balance.
   */
  pay: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a usdc transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  usdc: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  owner: (options?: MethodOptions) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pause: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a vault transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  vault: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  paused: (options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unpause: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_lock transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Locks savings withdrawals until `until`; a lock can only be extended.
   */
  set_lock: ({user, until}: {user: string, until: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_split transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_split: ({user, bps}: {user: string, bps: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a account_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  account_of: ({user}: {user: string}, options?: MethodOptions) => Promise<AssembledTransaction<Account>>

  /**
   * Construct and simulate a withdraw_spend transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_spend: ({user, amount}: {user: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a withdraw_savings transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Redeems vault shares and sends the resulting USDC to the user.
   */
  withdraw_savings: ({user, shares}: {user: string, shares: i128}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {owner, usdc, vault}: {owner: string, usdc: string, vault: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({owner, usdc, vault}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAH9QYXlzIGB0b2AgdGhyb3VnaCB0aGUgc3BsaXR0ZXI6IHRoZSBzYXZpbmdzIHNoYXJlIG9mIGBhbW91bnRgIGdvZXMgdG8KdGhlIHZhdWx0LCB0aGUgcmVzdCBpcyBjcmVkaXRlZCB0byB0aGUgc3BlbmRhYmxlIGJhbGFuY2UuAAAAAANwYXkAAAAAAwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAANSW52YWxpZEFtb3VudAAAAAAAAAEAAAAAAAAADEludmFsaWRTcGxpdAAAAAIAAAAAAAAAEUluc3VmZmljaWVudFNwZW5kAAAAAAAAAwAAAAAAAAASSW5zdWZmaWNpZW50U2hhcmVzAAAAAAAEAAAAAAAAAA1TYXZpbmdzTG9ja2VkAAAAAAAABQAAAAAAAAAPTG9ja05vdEV4dGVuZGVkAAAAAAYAAAAAAAAAD0VtcHR5V2l0aGRyYXdhbAAAAAAHAAAAAAAAAAtMb2NrVG9vTG9uZwAAAAAI",
        "AAAAAAAAAAAAAAAEdXNkYwAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAFb3duZXIAAAAAAAAAAAAAAQAAA+gAAAAT",
        "AAAAAAAAAAAAAAAFcGF1c2UAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAFdmF1bHQAAAAAAAAAAAAAAQAAABM=",
        "AAAAAQAAAAAAAAAAAAAAB0FjY291bnQAAAAABAAAAAAAAAAKbG9ja191bnRpbAAAAAAABgAAAAAAAAAGc2hhcmVzAAAAAAALAAAAAAAAAAVzcGVuZAAAAAAAAAsAAAAAAAAACXNwbGl0X2JwcwAAAAAAAAQ=",
        "AAAAAAAAAAAAAAAGcGF1c2VkAAAAAAAAAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAHdW5wYXVzZQAAAAAAAAAAAA==",
        "AAAAAAAAAEVMb2NrcyBzYXZpbmdzIHdpdGhkcmF3YWxzIHVudGlsIGB1bnRpbGA7IGEgbG9jayBjYW4gb25seSBiZSBleHRlbmRlZC4AAAAAAAAIc2V0X2xvY2sAAAACAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAFdW50aWwAAAAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAJc2V0X3NwbGl0AAAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAAA2JwcwAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAAKYWNjb3VudF9vZgAAAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAH0AAAAAdBY2NvdW50AA==",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAMAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAEdXNkYwAAABMAAAAAAAAABXZhdWx0AAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAOd2l0aGRyYXdfc3BlbmQAAAAAAAIAAAAAAAAABHVzZXIAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAD5SZWRlZW1zIHZhdWx0IHNoYXJlcyBhbmQgc2VuZHMgdGhlIHJlc3VsdGluZyBVU0RDIHRvIHRoZSB1c2VyLgAAAAAAEHdpdGhkcmF3X3NhdmluZ3MAAAACAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAGc2hhcmVzAAAAAAALAAAAAQAAAAs=",
        "AAAABAAAAAAAAAAAAAAADE93bmFibGVFcnJvcgAAAAMAAAAAAAAAC093bmVyTm90U2V0AAAACDQAAAAAAAAAElRyYW5zZmVySW5Qcm9ncmVzcwAAAAAINQAAAAAAAAAPT3duZXJBbHJlYWR5U2V0AAAACDY=",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbnRyYWN0IGlzIHBhdXNlZC4AAAAAAAAAAAAGUGF1c2VkAAAAAAABAAAABnBhdXNlZAAAAAAAAAAAAAI=",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbnRyYWN0IGlzIHVucGF1c2VkLgAAAAAAAAAIVW5wYXVzZWQAAAABAAAACHVucGF1c2VkAAAAAAAAAAI=",
        "AAAABAAAAAAAAAAAAAAADVBhdXNhYmxlRXJyb3IAAAAAAAACAAAANFRoZSBvcGVyYXRpb24gZmFpbGVkIGJlY2F1c2UgdGhlIGNvbnRyYWN0IGlzIHBhdXNlZC4AAAANRW5mb3JjZWRQYXVzZQAAAAAAA+gAAAA4VGhlIG9wZXJhdGlvbiBmYWlsZWQgYmVjYXVzZSB0aGUgY29udHJhY3QgaXMgbm90IHBhdXNlZC4AAAANRXhwZWN0ZWRQYXVzZQAAAAAAA+k=" ]),
      options
    )
  }
  public readonly fromJSON = {
    pay: this.txFromJSON<null>,
        usdc: this.txFromJSON<string>,
        owner: this.txFromJSON<Option<string>>,
        pause: this.txFromJSON<null>,
        vault: this.txFromJSON<string>,
        paused: this.txFromJSON<boolean>,
        unpause: this.txFromJSON<null>,
        set_lock: this.txFromJSON<null>,
        set_split: this.txFromJSON<null>,
        account_of: this.txFromJSON<Account>,
        withdraw_spend: this.txFromJSON<null>,
        withdraw_savings: this.txFromJSON<i128>
  }
}