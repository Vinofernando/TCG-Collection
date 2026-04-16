import CardFilter from "../components/CardFilter";
import type { Cards, SingleCard } from "@shared/index.js";
import { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import CardDetail from "../components/CardDetail";
import "../styles/home.css";
import Pagination from "../components/Pagination";
export default function BoosterPack() {
  const [data, setData] = useState<Cards[]>([]);
  const [filter, setFilter] = useState("Booster pack");
  const [searchByName, setSearchByName] = useState("");
  const [packId, setPackId] = useState("569101");
  const [selectedCard, setSelectedCard] = useState<SingleCard[]>([]);
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(1);
  const [category, setCategory] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [getDataLength, setGetDataLength] = useState(0);

  const limit = 20;
  useEffect(() => {
    fetch(
      `http://127.0.0.1:3000/card?limit=1000&packId=${packId}&cardName=${searchByName}${category.length === 0 ? "" : `&category=${category.join(`&category=`)}`}${color.length === 0 ? "" : `&color=${color.join(`&color=`)}`}`,
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setPage(Math.ceil(data.length / limit));
        setGetDataLength(data.length);
      });
  });

  useEffect(() => {
    fetch(
      `http://[::1]:3000/card?limit=${limit}&packId=${packId}&page=${active}&cardName=${searchByName}${category.length === 0 ? "" : `&category=${category.join(`&category=`)}`}${color.length === 0 ? "" : `&color=${color.join(`&color=`)}`}`,
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setData(data))
      .catch((error) =>
        console.error("Problem with the fetch operation:", error),
      );
  }, [
    packId,
    limit,
    active,
    searchByName,
    category.join(","),
    color.join(","),
  ]);

  const fetchSingleCard = (url: string) => {
    setSelectedCard([]);
    setImgUrl(url);
    setIsLoading(true);

    fetch(`http://[::1]:3000/card/series?imgUrl=${encodeURIComponent(url)}`)
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

  const closeModal = () => {
    setSelectedCard([]);
    setImgUrl("");
  };

  if (active > page) {
    setActive(1);
  }
  return (
    <div>
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        Booster pack
      </h1>
      <SearchBox
        searchByName={searchByName}
        setSearchByName={setSearchByName}
      />
      <CardFilter
        filter={filter}
        setFilter={setFilter}
        packFilter={packId}
        setBoosterFilter={setPackId}
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
                    key={card.id}
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
