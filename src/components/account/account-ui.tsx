import { useQueryClient } from "@tanstack/react-query";
import { useWalletUi } from "@wallet-ui/react";
import { type Address, address, type Lamports, lamportsToSol } from "gill";
import { RefreshCw } from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useMemo, useState } from "react";
import { AppAlert } from "@/components/app-alert";
import { AppModal } from "@/components/app-modal";
import { ExplorerLink } from "@/components/cluster/cluster-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ellipsify } from "@/lib/utils";
import {
  useGetBalanceQuery,
  useGetSignaturesQuery,
  useGetTokenAccountsQuery,
  useRequestAirdropMutation,
  useTransferSolMutation,
} from "./account-data-access";

export function AccountBalance({
  address: walletAddress,
}: {
  address: Address;
}) {
  const query = useGetBalanceQuery({ address: walletAddress });

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: TODO
    // biome-ignore lint/a11y/useKeyWithClickEvents: TODO
    <h1
      className="cursor-pointer font-bold text-5xl"
      onClick={() => query.refetch()}
    >
      {query.data?.value ? <BalanceSol balance={query.data?.value} /> : "..."}{" "}
      SOL
    </h1>
  );
}

export function AccountChecker() {
  const { account } = useWalletUi();
  if (!account) {
    return null;
  }
  return <AccountBalanceCheck address={address(account.address)} />;
}

export function AccountBalanceCheck({
  address: walletAddress,
}: {
  address: Address;
}) {
  const { cluster } = useWalletUi();
  const mutation = useRequestAirdropMutation({ address: walletAddress });
  const query = useGetBalanceQuery({ address: walletAddress });

  if (query.isLoading) {
    return null;
  }
  if (query.isError || !query.data?.value) {
    return (
      <AppAlert
        action={
          <Button
            onClick={() =>
              mutation.mutateAsync(1).catch((err) => console.log(err))
            }
            variant="outline"
          >
            Request Airdrop
          </Button>
        }
      >
        You are connected to <strong>{cluster.label}</strong> but your account
        is not found on this cluster.
      </AppAlert>
    );
  }
  return null;
}

export function AccountButtons({
  address: walletAddress,
}: {
  address: Address;
}) {
  const { cluster } = useWalletUi();

  return (
    <div>
      <div className="space-x-2">
        {cluster.id === "solana:mainnet" ? null : (
          <ModalAirdrop address={walletAddress} />
        )}
        <ErrorBoundary errorComponent={() => null}>
          <ModalSend address={walletAddress} />
        </ErrorBoundary>
        <ModalReceive address={walletAddress} />
      </div>
    </div>
  );
}

export function AccountTokens({
  address: walletAddress,
}: {
  address: Address;
}) {
  const [showAll, setShowAll] = useState(false);
  const query = useGetTokenAccountsQuery({ address: walletAddress });
  const client = useQueryClient();
  const items = useMemo(() => {
    if (showAll) return query.data;
    return query.data?.slice(0, 5);
  }, [query.data, showAll]);

  return (
    <div className="space-y-2">
      <div className="justify-between">
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">Token Accounts</h2>
          <div className="space-x-2">
            {query.isLoading ? (
              <span className="loading loading-spinner" />
            ) : (
              <Button
                onClick={async () => {
                  await query.refetch();
                  await client.invalidateQueries({
                    queryKey: ["getTokenAccountBalance"],
                  });
                }}
                variant="outline"
              >
                <RefreshCw size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
      {query.isError && (
        <pre className="alert alert-error">
          Error: {query.error?.message.toString()}
        </pre>
      )}
      {query.isSuccess && (
        <div>
          {query.data.length === 0 ? (
            <div>No token accounts found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Public Key</TableHead>
                  <TableHead>Mint</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map(({ account, pubkey }) => (
                  <TableRow key={pubkey.toString()}>
                    <TableCell>
                      <div className="flex space-x-2">
                        <span className="font-mono">
                          <ExplorerLink
                            address={pubkey.toString()}
                            label={ellipsify(pubkey.toString())}
                          />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <span className="font-mono">
                          <ExplorerLink
                            address={account.data.parsed.info.mint.toString()}
                            label={ellipsify(account.data.parsed.info.mint)}
                          />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono">
                        {account.data.parsed.info.tokenAmount.uiAmount}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}

                {(query.data?.length ?? 0) > 5 && (
                  <TableRow>
                    <TableCell className="text-center" colSpan={4}>
                      <Button
                        onClick={() => setShowAll(!showAll)}
                        variant="outline"
                      >
                        {showAll ? "Show Less" : "Show All"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}

export function AccountTransactions({
  address: walletAddress,
}: {
  address: Address;
}) {
  const query = useGetSignaturesQuery({ address: walletAddress });
  const [showAll, setShowAll] = useState(false);

  const items = useMemo(() => {
    if (showAll) return query.data;
    return query.data?.slice(0, 5);
  }, [query.data, showAll]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">Transaction History</h2>
        <div className="space-x-2">
          {query.isLoading ? (
            <span className="loading loading-spinner" />
          ) : (
            <Button onClick={() => query.refetch()} variant="outline">
              <RefreshCw size={16} />
            </Button>
          )}
        </div>
      </div>
      {query.isError && (
        <pre className="alert alert-error">
          Error: {query.error?.message.toString()}
        </pre>
      )}
      {query.isSuccess && (
        <div>
          {query.data.length === 0 ? (
            <div>No transactions found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signature</TableHead>
                  <TableHead className="text-right">Slot</TableHead>
                  <TableHead>Block Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.signature}>
                    <TableHead className="font-mono">
                      <ExplorerLink
                        label={ellipsify(item.signature, 8)}
                        transaction={item.signature}
                      />
                    </TableHead>
                    <TableCell className="text-right font-mono">
                      <ExplorerLink
                        block={item.slot.toString()}
                        label={item.slot.toString()}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(
                        (Number(item.blockTime) ?? 0) * 1000
                      ).toISOString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.err ? (
                        <span
                          className="text-red-500"
                          title={JSON.stringify(item.err)}
                        >
                          Failed
                        </span>
                      ) : (
                        <span className="text-green-500">Success</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(query.data?.length ?? 0) > 5 && (
                  <TableRow>
                    <TableCell className="text-center" colSpan={4}>
                      <Button
                        onClick={() => setShowAll(!showAll)}
                        variant="outline"
                      >
                        {showAll ? "Show Less" : "Show All"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}

function BalanceSol({ balance }: { balance: Lamports }) {
  return <span>{lamportsToSol(balance)}</span>;
}

function ModalReceive({ address: walletAddress }: { address: Address }) {
  return (
    <AppModal title="Receive">
      <p>Receive assets by sending them to your public key:</p>
      <code>{walletAddress.toString()}</code>
    </AppModal>
  );
}

function ModalAirdrop({ address: walletAddress }: { address: Address }) {
  const mutation = useRequestAirdropMutation({ address: walletAddress });
  const [amount, setAmount] = useState("2");

  return (
    <AppModal
      submit={() => mutation.mutateAsync(Number.parseFloat(amount))}
      submitDisabled={!amount || mutation.isPending}
      submitLabel="Request Airdrop"
      title="Airdrop"
    >
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={mutation.isPending}
        id="amount"
        min="1"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  );
}

function ModalSend(props: { address: Address }) {
  const mutation = useTransferSolMutation({ address: props.address });
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("1");

  if (!props.address) {
    return <div>Wallet not connected</div>;
  }

  return (
    <AppModal
      submit={async () => {
        await mutation.mutateAsync({
          destination: address(destination),
          amount: Number.parseFloat(amount),
        });
      }}
      submitDisabled={!(destination && amount) || mutation.isPending}
      submitLabel="Send"
      title="Send"
    >
      <Label htmlFor="destination">Destination</Label>
      <Input
        disabled={mutation.isPending}
        id="destination"
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Destination"
        type="text"
        value={destination}
      />
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={mutation.isPending}
        id="amount"
        min="1"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  );
}
