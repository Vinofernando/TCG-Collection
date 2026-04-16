import type { PaginationType } from "@shared/index";
import { Pagination as RemotePagination, Container } from "react-bootstrap";

export default function Pagination({
  page,
  active,
  setActive,
}: PaginationType) {
  // const [active, setActive] = useState(1);

  const limitPage = 5;
  let start = Math.max(1, active - Math.floor(limitPage / 2));
  const end = Math.min(page, start + limitPage - 1);

  if (end - start + 1 < limitPage) {
    start = Math.max(1, end - limitPage + 1);
  }
  const items = [];
  for (let number = start; number <= end; number++) {
    items.push(
      <RemotePagination.Item
        key={number}
        active={number === active}
        onClick={() => setActive(number)}
        activeLabel=""
      >
        {number}
      </RemotePagination.Item>,
    );
  }
  return (
    <Container className="mt-5 d-flex justify-content-center">
      <RemotePagination
        style={{
          listStyle: "none",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <RemotePagination.First
          onClick={() => setActive(1)}
          disabled={active === 1}
        />

        <RemotePagination.Prev
          onClick={() => setActive(Math.max(1, active - 1))}
          disabled={active === 1}
        />

        {start > 1 && (
          <RemotePagination.Ellipsis onClick={() => setActive(start - 1)} />
        )}
        {items}
        {end < page && (
          <RemotePagination.Ellipsis onClick={() => setActive(end + 1)} />
        )}
        <RemotePagination.Next
          onClick={() => setActive(Math.min(page, active + 1))}
          disabled={active === page}
        />
        <RemotePagination.Last
          onClick={() => setActive(page)}
          disabled={active === page}
        />
      </RemotePagination>
    </Container>
  );
}
