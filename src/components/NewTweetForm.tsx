import {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import Button from "./Button";
import ProfileImage from "./ProfileImage";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./Loading";

const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};

const NewTweetForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <Form />;
};

function Form() {
  const [inputValue, setInputValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const session = useSession();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  if (session.status !== "authenticated") return null;

  const { mutate, isLoading } = api.tweet.create.useMutation({
    onSuccess: () => {
      setInputValue("");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ content: inputValue });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-4"
    >
      <div className="flex gap-4">
        {/* profile Image here */}
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={inputRef}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="What's happening?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        ></textarea>
      </div>
      <Button className="self-end" disabled={isLoading}>
        {!isLoading ? "Tweet" : <LoadingSpinner />}
      </Button>
    </form>
  );
}
export default NewTweetForm;
