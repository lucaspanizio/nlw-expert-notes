import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { useState } from "react";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const dateCard = formatDistanceToNow(note.date, {
    locale: ptBR,
    addSuffix: true,
  });

  const handleDeleteNote = () => {
    setModalIsOpen(false);
    onNoteDeleted(note.id);
  };

  return (
    <Dialog.Root open={modalIsOpen} onOpenChange={setModalIsOpen}>
      <Dialog.Trigger
        className="rounded-md text-left flex-col bg-slate-800 p-5 gap-3 
        outline-none overflow-hidden  relative hover:ring-2 
        hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400"
      >
        <span className="text-sm font-medium text-slate-300">{dateCard}</span>
        <p className="text-sm leading-6 text-slate-400">{note.content}</p>

        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 
        bg-gradient-to-t from-black/60 to-black/0 pointer-events-none"
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content
          className="fixed overflow-hidden w-full inset-0 
          md:inset-auto md:left-1/2 md:top-1/2 md:rounded-md
          md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh]
        bg-slate-700 flex flex-col outline-none"
        >
          <Dialog.Close
            className="absolute right-0 top-0
           bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100"
          >
            <X size={"1rem"} />
          </Dialog.Close>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {dateCard}
            </span>
            <p className="text-sm leading-6 text-slate-400">{note.content}</p>
          </div>

          <button
            type="button"
            className="w-full bg-slate-800 py-4 outline-none
            text-sm text-center text-slate-300 font-medium group"
            onClick={handleDeleteNote}
          >
            Deseja{" "}
            <span className="text-red-400 group-hover:underline">
              apagar essa nota
            </span>{" "}
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
