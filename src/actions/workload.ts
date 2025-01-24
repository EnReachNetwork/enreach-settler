import { Workload } from "../types/workload.js";

const accounts = [
  "0xDEDe0DAA3A63958d7f6544E4AD4C8b1CA66fAFe8",
  "0x0c7FF051D8A472D0023343c536174575D666E15e",
  "0x3704b7461D2Bd7Fbfd5C7ea6B0F2Bd6671F3D3AD",
  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
  "0x1A005651ee017c8b4f1FBd0DDf7853dC4A185ED1",
];

export const getWorkload = async (epoch: number): Promise<Workload | null> => {
  const res = await fetch(
    `http://150.109.123.18:1317/enreach/workload/workload/${epoch}`,
  ).then((r) => r.json());

  if (res?.Workload) {
    return {
      ...res?.Workload,
      account:
        accounts[Number((res?.Workload as Workload).epoch) % accounts.length],
    } as Workload;
  }

  return null;
};
