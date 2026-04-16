import type { SingleCard } from "@shared/index.js";
import "../styles/card-details.css";
import { motion } from "framer-motion";
export default function CardDetail({
  data,
  imgUrl,
}: {
  data: SingleCard;
  imgUrl: string;
}) {
  return (
    <motion.div // Keadaan awal (sebelum masuk)
      initial={{ opacity: 0, y: 50 }}
      // Keadaan saat sudah masuk/muncul
      animate={{ opacity: 1, y: 0 }}
      // Pengaturan durasi dan kehalusan
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="card-style card-detail"
    >
      <img
        src={"https://wsrv.nl/?url=" + encodeURIComponent(imgUrl)}
        alt=""
        className="img-detail"
      />
      <div className="detail-text">
        <h2 className="name-span bold">{data.name}</h2>
        <div className="title">
          <h2>{data.id} | </h2>
          <h2>{data.rarity} | </h2>
          <h2>{data.category} </h2>
        </div>
        <h3>
          <span className="bold">Cost</span> {data.cost}
        </h3>
        <h3>
          <span className="bold">Attributes</span>{" "}
          {data.attributes.length > 1 ? data.attributes : "-"}
        </h3>
        <h3>
          <span className="bold">Power</span>{" "}
          {data.power !== 0 ? data.power : "-"}
        </h3>
        <h3>
          <span className="bold">Counter</span>{" "}
          {data.counter !== 0 ? data.counter : "-"}
        </h3>
        <h3 className="types-span">
          <span className="bold">Types</span> {data.types}
        </h3>
        {data.effect && (
          <h3 className="effect-detail">
            <span className="bold">Effect</span> {data.effect}
          </h3>
        )}
        {data.trigger && (
          <h3 className="trigger-detail">
            <span className="bold">Trigger</span> {data.trigger}
          </h3>
        )}
      </div>
    </motion.div>
  );
}
