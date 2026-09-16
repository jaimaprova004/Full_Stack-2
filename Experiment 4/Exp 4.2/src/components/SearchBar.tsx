type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar = ({ value, onChange }: Props) => {
  return (
    <label className="search-bar">
      Search posts
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title or body"
      />
    </label>
  );
};
