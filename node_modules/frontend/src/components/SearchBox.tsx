import type { SearchType } from "@shared/index";

export default function SearchBox({
  searchByName,
  setSearchByName,
}: SearchType) {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
      <input
        type="text"
        value={searchByName}
        onChange={(e) => setSearchByName(e.target.value)}
        style={{
          border: "1px solid gray",
          borderRadius: "10px",
          width: "30%",
        }}
      />
    </div>
  );
}
