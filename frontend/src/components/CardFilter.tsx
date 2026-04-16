import type { CardFilterType } from "@shared/index";
import { useNavigate } from "react-router-dom";
import Select, { type MultiValue } from "react-select";

export default function CardFilter({
  filter,
  categoryFilter = [],
  setCategoryFilter,
  setFilter,
  packFilter,
  setStFilter,
  setBoosterFilter,
  colorFilter = [],
  setColorFilter,
}: CardFilterType) {
  const navigate = useNavigate();

  const categoryOptions = [
    { value: "leader", label: "Leader" },
    { value: "character", label: "Character" },
    { value: "event", label: "Event" },
    { value: "stage", label: "Stage" }, // Tambahan umum di TCG
  ];

  const colorsOptions = [
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "black", label: "Black" },
    { value: "yellow", label: "Yellow" },
  ];

  // Helper untuk mengubah array string ke format react-select
  const getValueFromOptions = (options: any[], values: string[]) =>
    options.filter((opt) => values.includes(opt.value));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setFilter(selectedValue);

    // Navigasi berdasarkan pilihan
    if (selectedValue === "Starter deck") navigate("/starter-deck");
    else if (selectedValue === "Booster pack") navigate("/booster-pack");
    else navigate("/");
  };

  const customStyles = {
    container: (base: any) => ({ ...base }),
    control: (base: any) => ({
      ...base,
      borderRadius: "4px",
      minHeight: "38px",
      cursor: "pointer",
    }),
  };

  return (
    <div
      className="filter-container"
      style={{
        display: "flex",
        gap: "12px", // Sedikit lebih renggang
        justifyContent: "center",
        margin: "10px",
      }}
    >
      {/* 1. Main Pack Filter */}
      <select
        value={filter}
        onChange={handleChange}
        className="main-select"
        style={{ padding: "8px", borderRadius: "4px" }}
      >
        <option value="" disabled>
          -- Filter by pack --
        </option>
        <option value="All">All Cards</option>
        <option value="Starter deck">Starter Deck</option>
        <option value="Booster pack">Booster Pack</option>
      </select>

      {/* 2. Category Multi-Select (Disembunyikan jika Starter Deck sesuai logika Anda) */}
      {filter !== "Starter deck" && (
        <>
          <Select
            isMulti
            options={categoryOptions}
            placeholder="Select Category..."
            styles={customStyles}
            value={getValueFromOptions(categoryOptions, categoryFilter)}
            onChange={(val) =>
              setCategoryFilter(val ? val.map((v) => v.value) : [])
            }
            closeMenuOnSelect={false}
            blurInputOnSelect={false}
          />

          <Select
            isMulti
            options={colorsOptions}
            placeholder="Select Colors..."
            styles={customStyles}
            value={getValueFromOptions(colorsOptions, colorFilter)}
            onChange={(val) =>
              setColorFilter(val ? val.map((v) => v.value) : [])
            }
            closeMenuOnSelect={false}
            blurInputOnSelect={false}
          />
        </>
      )}

      {/* 3. Conditional Pack ID Lists */}
      {filter === "Starter deck" && (
        <select
          value={packFilter}
          onChange={(e) => setStFilter(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="" disabled>
            -- Select ST ID --
          </option>
          {[...Array(29)].map((_, i) => {
            const id = (i + 1).toString().padStart(2, "0");
            const val = 569001 + i;
            return <option key={id} value={val}>{`ST-${id}`}</option>;
          })}
        </select>
      )}

      {filter === "Booster pack" && (
        <select
          value={packFilter}
          onChange={(e) => setBoosterFilter(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="" disabled>
            -- Select OP ID --
          </option>
          {[...Array(15)].map((_, i) => {
            const id = (i + 1).toString().padStart(2, "0");
            const val = 569101 + i;
            return <option key={id} value={val}>{`OP-${id}`}</option>;
          })}
        </select>
      )}
    </div>
  );
}
