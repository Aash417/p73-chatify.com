import { atom, useAtom } from 'jotai';

const modalAtom = atom(false);

export function useCreateChannelModal() {
   return useAtom(modalAtom);
}
