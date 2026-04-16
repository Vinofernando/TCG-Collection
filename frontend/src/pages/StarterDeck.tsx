import CardFilter from "../components/CardFilter";
import type { Cards, SingleCard } from "@shared/index.js";
import { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import CardDetail from "../components/CardDetail";
import "../styles/home.css";
export default function StarterDeck() {
  const [data, setData] = useState<Cards[]>([]);
  const [filter, setFilter] = useState("Starter deck");
  const [searchByName, setSearchByName] = useState("");
  const [packId, setPackId] = useState("569001");
  const [selectedCard, setSelectedCard] = useState<SingleCard[]>([]);
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const limit = 50;
  useEffect(() => {
    fetch(`http://[::1]:3000/card?limit=${limit}&packId=${packId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setData(data))
      .catch((error) =>
        console.error("Problem with the fetch operation:", error),
      );
  }, [packId]);

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

  console.log(packId);
  console.log(data);
  return (
    <div>
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        Starter Deck
      </h1>
      <SearchBox
        searchByName={searchByName}
        setSearchByName={setSearchByName}
      />
      <CardFilter
        filter={filter}
        setFilter={setFilter}
        packFilter={packId}
        setStFilter={setPackId}
      />
      <h2 style={{ display: "flex", justifyContent: "center" }}>
        Result: {data.length}
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
    </div>
  );
}
