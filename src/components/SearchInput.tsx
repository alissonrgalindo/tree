import { ChangeEvent, KeyboardEvent } from "react";
import SearchIcon from "@/assets/icons/search.svg";
import CloseIcon from "@/assets/icons/close.svg";

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  onClear,
  placeholder = "Search Asset or Location"
}: SearchInputProps) {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search asset tree"
      />
      {!value && (
        <img
          src={SearchIcon}
          alt="Search Icon"
          className="absolute right-3 top-3.5 text-gray-400"
          aria-hidden="true"
        />
      )}
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2.5 top-3.5 text-gray-400 hover:text-gray-600 w-[16px] h-[16px]"
          aria-label="Clear search"
        >
          <img
            src={CloseIcon}
            alt="Clear"
            className="absolute right-0 top-0 text-gray-400 w-[16px] h-[16px]"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}