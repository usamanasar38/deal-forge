/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/dealforge.json`.
 */
export type Dealforge = {
  "address": "FVszYwFasoQN81yjF4LMCYSzKaGUWkf9KTb3wTrs7mBd",
  "metadata": {
    "name": "dealforge",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "makeOffer",
      "discriminator": [
        214,
        98,
        97,
        35,
        59,
        12,
        44,
        178
      ],
      "accounts": [
        {
          "name": "maker",
          "writable": true,
          "signer": true
        },
        {
          "name": "offeredMint"
        },
        {
          "name": "requestedMint"
        },
        {
          "name": "makerOfferedAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "maker"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "offeredMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "counter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  77,
                  65,
                  75,
                  69,
                  82,
                  95,
                  67,
                  79,
                  85,
                  78,
                  84,
                  69,
                  82,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "maker"
              }
            ]
          }
        },
        {
          "name": "offer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  79,
                  70,
                  70,
                  69,
                  82,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "maker"
              },
              {
                "kind": "account",
                "path": "counter.id",
                "account": "makerCounter"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "offer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "offeredMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "offeredAmount",
          "type": "u64"
        },
        {
          "name": "requestedAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "makerCounter",
      "discriminator": [
        86,
        129,
        100,
        95,
        125,
        24,
        138,
        26
      ]
    },
    {
      "name": "offer",
      "discriminator": [
        215,
        88,
        60,
        71,
        170,
        162,
        73,
        229
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficientBalance",
      "msg": "Insufficient token balance"
    },
    {
      "code": 6001,
      "name": "transferFailed",
      "msg": "Token transfer failed"
    },
    {
      "code": 6002,
      "name": "invalidSaleToken",
      "msg": "Invalid sale token"
    },
    {
      "code": 6003,
      "name": "calculationOverflow",
      "msg": "Calculation overflow"
    },
    {
      "code": 6004,
      "name": "offerNotActive",
      "msg": "Offer is not active"
    },
    {
      "code": 6005,
      "name": "exceedsAvailableQuantity",
      "msg": "Exceeds available quantity"
    },
    {
      "code": 6006,
      "name": "offerAlreadyFulfilled",
      "msg": "Offer already fulfilled"
    },
    {
      "code": 6007,
      "name": "offerExpired",
      "msg": "Offer expired"
    },
    {
      "code": 6008,
      "name": "unauthorizedMaker",
      "msg": "unauthorized maker"
    }
  ],
  "types": [
    {
      "name": "makerCounter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "offer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "Unique identifier for the offer (counter for each user)"
            ],
            "type": "u64"
          },
          {
            "name": "maker",
            "docs": [
              "The maker (offer creator)"
            ],
            "type": "pubkey"
          },
          {
            "name": "vault",
            "docs": [
              "The token account that will hold maker’s offered tokens (PDA vault)"
            ],
            "type": "pubkey"
          },
          {
            "name": "offeredMint",
            "docs": [
              "The token mint being offered"
            ],
            "type": "pubkey"
          },
          {
            "name": "offeredAmount",
            "docs": [
              "Amount of offered tokens"
            ],
            "type": "u64"
          },
          {
            "name": "requestedMint",
            "docs": [
              "The token mint that initializer is requesting"
            ],
            "type": "pubkey"
          },
          {
            "name": "requestedAmount",
            "docs": [
              "Amount of requested tokens"
            ],
            "type": "u64"
          },
          {
            "name": "status",
            "docs": [
              "Expiry timestamp (unix time), after which initializer can cancel",
              "Status of the deal-forge (e.g., Active, Completed, Canceled)"
            ],
            "type": {
              "defined": {
                "name": "offerStatus"
              }
            }
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed (to derive vault PDA)"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "offerStatus",
      "docs": [
        "Possible states of an deal-forge"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "fulfilled"
          },
          {
            "name": "canceled"
          },
          {
            "name": "expired"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "makerCounterSeed",
      "type": "string",
      "value": "\"MAKER_COUNTER_SEED\""
    },
    {
      "name": "offerSeed",
      "type": "string",
      "value": "\"OFFER_SEED\""
    }
  ]
};
