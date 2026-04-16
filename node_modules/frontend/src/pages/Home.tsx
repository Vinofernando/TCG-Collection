import { useEffect, useState } from "react";
import type { Cards, SingleCard } from "@shared/index.js";
import CardDetail from "../components/CardDetail";
import "../styles/home.css";
import CardFilter from "../components/CardFilter";
import Pagination from "../components/Pagination";
import SearchBox from "../components/SearchBox";

export default function Home() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Cards[]>([]);
  const [selectedCard, setSelectedCard] = useState<SingleCard[]>([]);
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchByName, setSearchByName] = useState("");
  const [filter, setFilter] = useState("");
  const [active, setActive] = useState(1);
  const [category, setCategory] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [getDataLength, setGetDataLength] = useState(0);

  // 1. Tambahkan state untuk limit
  const [limit, setLimit] = useState(20); // Nilai default

  // 2. Fungsi untuk menentukan limit berdasarkan lebar layar
  const updateLimit = () => {
    if (window.matchMedia("(min-width: 1200px)").matches) {
      setLimit(20); // Desktop besar
    } else if (window.matchMedia("(min-width: 768px)").matches) {
      setLimit(18); // Tablet
    } else {
      setLimit(12); // Mobile
    }
  };

  useEffect(() => {
    const fetchTotal = async () => {
      const url = `http://127.0.0.1:3000/card?limit=3976${searchByName ? `&cardName=${searchByName}` : ""}${category.length === 0 ? "" : `&category=${category.join(`&category=`)}`}${color.length === 0 ? "" : `&color=${color.join(`&color=`)}`}`;
      try {
        const res = await fetch(url);
        const result = await res.json();
        setPage(Math.ceil(result.length / limit));
        setGetDataLength(result.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTotal();
  }, [searchByName, category.join(","), limit, color.join(",")]);
  // 3. Effect untuk memantau perubahan layar
  useEffect(() => {
    updateLimit(); // Set awal saat load

    // Gunakan MediaQueryListener agar lebih efisien dibanding event 'resize' biasa
    const tabletQuery = window.matchMedia("(min-width: 768px)");
    const desktopQuery = window.matchMedia("(min-width: 1200px)");

    tabletQuery.addEventListener("change", updateLimit);
    desktopQuery.addEventListener("change", updateLimit);

    return () => {
      tabletQuery.removeEventListener("change", updateLimit);
      desktopQuery.removeEventListener("change", updateLimit);
    };
  }, []);

  // 1. Pindahkan logika pembuatan URL ke DALAM useEffect atau gunakan useMemo
  useEffect(() => {
    const baseUrl = "http://127.0.0.1:3000/card";
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: active.toString(),
    });

    if (searchByName) params.append("cardName", searchByName);
    category.forEach((cat) => params.append("category", cat));
    color.forEach((cat) => params.append("color", cat));

    const finalUrl = `${baseUrl}?${params.toString()}`;

    console.log(finalUrl);
    const fetchData = async () => {
      try {
        const res = await fetch(finalUrl);
        if (!res.ok) throw new Error("Fetch failed");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Problem with the fetch operation:", error);
      }
    };

    fetchData();

    // HAPUS finalUrl dari dependency karena sudah dibuat di dalam
    // Gunakan category.join(",") agar React mengecek string-nya, bukan referensi array-nya
  }, [limit, active, searchByName, category.join(","), color.join(",")]);

  const closeModal = () => {
    setSelectedCard([]);
    setImgUrl("");
  };

  const fetchSingleCard = (url: string) => {
    setSelectedCard([]);
    setImgUrl(url);
    setIsLoading(true);

    fetch(`http://127.0.0.1:3000/card/series?imgUrl=${encodeURIComponent(url)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setSelectedCard(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h1 style={{ display: "flex", justifyContent: "center" }}>All cards</h1>
      <SearchBox
        searchByName={searchByName}
        setSearchByName={setSearchByName}
      />
      <CardFilter
        filter={filter}
        setFilter={setFilter}
        categoryFilter={category}
        setCategoryFilter={setCategory}
        colorFilter={color}
        setColorFilter={setColor}
      />
      <h2 style={{ display: "flex", justifyContent: "center" }}>
        Result: {getDataLength}
      </h2>
      <div className="img-grid">
        {data?.map((card) => (
          <img
            src={
              "https://wsrv.nl/?url=" + encodeURIComponent(card.img_full_url)
            }
            alt="img"
            referrerPolicy="no-referrer"
            key={card.id}
            onClick={() => fetchSingleCard(card.img_full_url)}
            className="home-img"
          />
        ))}

        {/* Modal logic tetap sama */}
        {(selectedCard.length !== 0 || isLoading) && (
          <div
            onClick={closeModal}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          >
            <div className="home-detail" onClick={(e) => e.stopPropagation()}>
              <div>
                <button onClick={closeModal} className="close-btn">
                  X
                </button>
              </div>
              {isLoading ? (
                <div style={{ color: "white" }}>Loading...</div>
              ) : (
                selectedCard.map((card) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <CardDetail data={card} imgUrl={imgUrl} key={card.id} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Pagination page={page} active={active} setActive={setActive} />
    </div>
  );
}
