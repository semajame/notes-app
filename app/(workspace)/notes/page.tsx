"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Note = {
  id: string;
  title: string;
  content: string | null;
};

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openNewModal = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setShowNewModal(true);
  };

  const closeModal = () => setShowNewModal(false);

  const createNote = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        user_id: "demo-user",
      }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setShowNewModal(false);
      fetchNotes();
    }
  };

  const updateNote = async () => {
    if (!selectedNote) return;

    await fetch(`/api/notes/${selectedNote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });

    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setTitle("");
      setContent("");
    }

    fetchNotes();
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content || "");
    setShowNewModal(false);
  };

  return (
     <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
