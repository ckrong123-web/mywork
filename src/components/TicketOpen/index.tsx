import Container from "../Container";
import TicketCard, { type TicketItem } from "../TicketCard";
import "./TicketOpen.scss";

interface TicketOpenProps {
  items: TicketItem[];
}

export default function TicketOpen({ items }: TicketOpenProps) {
  return (
    <section className="ticket-open" aria-labelledby="ticket-open-title">
      <Container className="ticket-open__inner">
        <div className="ticket-open__header">
          <h2 id="ticket-open-title" className="ticket-open__title">
            Ticket Open
          </h2>
          <span className="ticket-open__line" aria-hidden="true" />
        </div>
        <div className="ticket-open__grid">
          {items.map((item) => (
            <TicketCard key={item.title} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
