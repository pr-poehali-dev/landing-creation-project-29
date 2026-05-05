import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useYookassa, openPaymentPage } from "@/components/extensions/yookassa/useYookassa";

const YOOKASSA_API_URL = "https://functions.poehali.dev/7e68ab13-a54d-461f-9eee-15c0a6884fb6";
const RETURN_URL = `${window.location.origin}/success`;

const HERO_IMG = "https://cdn.poehali.dev/projects/28666ef4-1110-4722-bbfc-52ecc4d61d4f/files/d5bf26c7-e352-4f7d-a02f-77e7d0efceae.jpg";
const CROWD_IMG = "https://cdn.poehali.dev/projects/28666ef4-1110-4722-bbfc-52ecc4d61d4f/files/b6a72a4e-c14d-47a2-89cf-eaccbf0f2e3c.jpg";
const ARTIST_IMG = "https://cdn.poehali.dev/projects/28666ef4-1110-4722-bbfc-52ecc4d61d4f/files/8c03c898-1ef2-46c8-919f-c7426600e0fb.jpg";

const tickets = [
  {
    type: "ТРИБУНА",
    price: "1 800 ₽",
    amount: 1800,
    desc: "Лучший обзор зала",
    perks: ["Панорамный вид", "Удобные кресла", "Гардероб"],
    accent: "#FFD600",
    available: 180,
  },
  {
    type: "ПАРТЕР",
    price: "3 500 ₽",
    amount: 3500,
    desc: "Максимальная близость к сцене",
    perks: ["Первые ряды", "Напитки в зале", "Памятная программка"],
    accent: "#FF3D00",
    available: 42,
    featured: true,
  },
  {
    type: "VIP",
    price: "8 900 ₽",
    amount: 8900,
    desc: "Незабываемый опыт",
    perks: ["Встреча с артистом", "Backstage-тур", "Открытый бар", "Личный менеджер"],
    accent: "#00E5FF",
    available: 12,
  },
];

const galleryItems = [
  { img: HERO_IMG, label: "Концерт 2024 — Москва" },
  { img: CROWD_IMG, label: "Тур 2023 — Питер" },
  { img: ARTIST_IMG, label: "Backstage" },
  { img: CROWD_IMG, label: "Финал тура" },
  { img: HERO_IMG, label: "Open Air 2024" },
  { img: ARTIST_IMG, label: "Студия" },
];

function TicketPayModal({ ticket, onClose }: { ticket: typeof tickets[0]; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { createPayment, isLoading } = useYookassa({
    apiUrl: YOOKASSA_API_URL,
    onSuccess: (response) => {
      if (response.payment_url) openPaymentPage(response.payment_url);
    },
  });

  const handlePay = async () => {
    if (!email.includes("@")) { setError("Введите корректный email"); return; }
    setError("");
    await createPayment({
      amount: ticket.amount,
      userEmail: email,
      userName: name || undefined,
      returnUrl: RETURN_URL,
      cartItems: [{ id: ticket.type, name: `Билет ${ticket.type} — ЗВУК 2026`, price: ticket.amount, quantity: 1 }],
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="X" size={20} /></button>
        <div className="pay-modal__header">
          <div className="pay-modal__type" style={{ color: ticket.accent }}>{ticket.type}</div>
          <div className="pay-modal__price">{ticket.price}</div>
          <div className="pay-modal__event">ЗВУК · 15 августа 2026 · Stadium Live</div>
        </div>
        <div className="pay-modal__body">
          <div className="form-field">
            <label>Имя (необязательно)</label>
            <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Email *</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <span className="pay-modal__hint">На него придёт электронный билет</span>
          </div>
          {error && <div className="pay-modal__error">{error}</div>}
          <button
            className="ticket-card__btn"
            style={{ background: ticket.accent, marginTop: 8 }}
            onClick={handlePay}
            disabled={isLoading}
          >
            {isLoading ? "Создаём заказ..." : `Перейти к оплате · ${ticket.price}`}
          </button>
          <p className="pay-modal__secure">
            <Icon name="ShieldCheck" size={12} />
            Безопасная оплата через ЮКасса
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [galleryModal, setGalleryModal] = useState<number | null>(null);
  const [payTicket, setPayTicket] = useState<typeof tickets[0] | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="concert-root">
      {/* NAV */}
      <nav className={`concert-nav ${scrolled ? "concert-nav--scrolled" : ""}`}>
        <div className="concert-nav__logo" onClick={() => scrollTo("home")}>
          <span className="logo-text">ЗВУК</span>
          <span className="logo-dot" />
        </div>
        <div className={`concert-nav__links ${menuOpen ? "open" : ""}`}>
          {[["home", "Главная"], ["about", "О концерте"], ["tickets", "Билеты"], ["gallery", "Галерея"], ["contacts", "Контакты"]].map(([id, label]) => (
            <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</button>
          ))}
        </div>
        <button className="concert-nav__burger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero__bg" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="hero__noise" />
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="eyebrow-line" />
            <span className="eyebrow-text">15 августа 2026 · Москва · Stadium Live</span>
            <span className="eyebrow-line" />
          </div>
          <h1 className="hero__title">
            <span className="title-line title-line--1">ЭТО</span>
            <span className="title-line title-line--2">ЗВУК</span>
            <span className="title-line title-line--3">ЖИВОЙ</span>
          </h1>
          <p className="hero__sub">Единственный концерт в этом году.<br />Только живой звук, только настоящие эмоции.</p>
          <div className="hero__actions">
            <button className="btn-primary" onClick={() => scrollTo("tickets")}>Купить билет</button>
            <button className="btn-ghost" onClick={() => scrollTo("about")}>
              <Icon name="Play" size={16} />
              Узнать больше
            </button>
          </div>
          <div className="hero__stats">
            <div className="stat"><span className="stat__num">8 000</span><span className="stat__label">зрителей</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat__num">3 часа</span><span className="stat__label">живой музыки</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat__num">1 ночь</span><span className="stat__label">которую запомнишь</span></div>
          </div>
        </div>
        <div className="hero__scroll-hint" onClick={() => scrollTo("about")}>
          <span>Листай вниз</span>
          <Icon name="ChevronDown" size={20} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about">
        <div className="about__decor-num">01</div>
        <div className="about__grid">
          <div className="about__text-col">
            <p className="section-eyebrow">О концерте</p>
            <h2 className="section-title">Музыка,<br /><em>которая меняет</em></h2>
            <p className="about__desc">
              Это не просто концерт — это событие, которое собирает людей вместе уже третий год подряд.
              Живой звук, авторские декорации и световое шоу на трёх экранах создают атмосферу,
              которую невозможно передать словами.
            </p>
            <p className="about__desc">
              В программе — лучшие треки за 10 лет, специальные гости и несколько мировых премьер.
            </p>
            <div className="about__facts">
              {[
                { icon: "MapPin", text: "Stadium Live, Москва" },
                { icon: "Calendar", text: "15 августа 2026, 20:00" },
                { icon: "Clock", text: "Продолжительность ~3 часа" },
                { icon: "Users", text: "18+ (дети до 12 — бесплатно)" },
              ].map(({ icon, text }) => (
                <div className="fact-item" key={text}>
                  <Icon name={icon} fallback="Circle" size={18} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about__visual">
            <div className="about__img-frame">
              <img src={ARTIST_IMG} alt="Артист" />
              <div className="about__img-label">
                <span>10 лет на сцене</span>
              </div>
            </div>
            <div className="about__img-frame about__img-frame--small">
              <img src={CROWD_IMG} alt="Публика" />
            </div>
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="tickets">
        <div className="tickets__decor-num">02</div>
        <div className="tickets__header">
          <p className="section-eyebrow">Билеты</p>
          <h2 className="section-title">Выбери<br /><em>своё место</em></h2>
        </div>
        <div className="tickets__grid">
          {tickets.map((t, i) => (
            <div
              key={i}
              className={`ticket-card ${t.featured ? "ticket-card--featured" : ""} ${selectedTicket === i ? "ticket-card--selected" : ""}`}
              style={{ "--t-accent": t.accent } as React.CSSProperties}
              onClick={() => setSelectedTicket(selectedTicket === i ? null : i)}
            >
              {t.featured && <div className="ticket-card__badge">Хит продаж</div>}
              <div className="ticket-card__type">{t.type}</div>
              <div className="ticket-card__price">{t.price}</div>
              <div className="ticket-card__desc">{t.desc}</div>
              <ul className="ticket-card__perks">
                {t.perks.map((p) => (
                  <li key={p}>
                    <Icon name="Check" size={14} />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="ticket-card__avail">Осталось: {t.available} мест</div>
              <button className="ticket-card__btn" onClick={(e) => { e.stopPropagation(); setPayTicket(t); }}>Купить билет</button>
            </div>
          ))}
        </div>
        <p className="tickets__note">
          <Icon name="ShieldCheck" size={14} />
          Безопасная оплата · Электронные билеты на email · Возврат за 14 дней
        </p>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="gallery">
        <div className="gallery__decor-num">03</div>
        <div className="gallery__header">
          <p className="section-eyebrow">Галерея</p>
          <h2 className="section-title">Как это<br /><em>было раньше</em></h2>
        </div>
        <div className="gallery__grid">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`gallery-item ${i === 0 || i === 3 ? "gallery-item--wide" : ""}`}
              onClick={() => setGalleryModal(i)}
            >
              <img src={item.img} alt={item.label} />
              <div className="gallery-item__overlay">
                <span>{item.label}</span>
                <Icon name="Expand" size={18} />
              </div>
            </div>
          ))}
        </div>
        <div className="gallery__video-btn" onClick={() => scrollTo("about")}>
          <div className="gallery__video-inner">
            <Icon name="Play" size={40} />
            <span>Смотреть видео с концерта 2024</span>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="contacts">
        <div className="contacts__decor-num">04</div>
        <div className="contacts__grid">
          <div className="contacts__info">
            <p className="section-eyebrow">Контакты</p>
            <h2 className="section-title">Остались<br /><em>вопросы?</em></h2>
            <div className="contact-items">
              {[
                { icon: "Mail", label: "Email", value: "info@zvuk-concert.ru" },
                { icon: "Phone", label: "Телефон", value: "+7 (800) 123-45-67" },
                { icon: "MessageCircle", label: "Telegram", value: "@zvuk_support" },
                { icon: "MapPin", label: "Адрес", value: "Stadium Live, Лужники, Москва" },
              ].map(({ icon, label, value }) => (
                <div className="contact-item" key={label}>
                  <div className="contact-item__icon">
                    <Icon name={icon} fallback="Circle" size={20} />
                  </div>
                  <div>
                    <div className="contact-item__label">{label}</div>
                    <div className="contact-item__value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form className="contacts__form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-field">
                <label>Имя</label>
                <input type="text" placeholder="Ваше имя" />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" placeholder="you@email.com" />
              </div>
            </div>
            <div className="form-field">
              <label>Сообщение</label>
              <textarea rows={4} placeholder="Ваш вопрос..." />
            </div>
            <button type="submit" className="btn-primary btn-primary--full">Отправить сообщение</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="concert-footer">
        <div className="footer__logo" onClick={() => scrollTo("home")}>ЗВУК</div>
        <div className="footer__links">
          {[["home", "Главная"], ["about", "О концерте"], ["tickets", "Билеты"], ["gallery", "Галерея"], ["contacts", "Контакты"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}>{label}</button>
          ))}
        </div>
        <div className="footer__socials">
          {[
            { name: "Instagram", icon: "Instagram" },
            { name: "YouTube", icon: "Youtube" },
            { name: "Telegram", icon: "MessageCircle" },
          ].map(({ name, icon }) => (
            <button key={name} className="social-btn" title={name}>
              <Icon name={icon} fallback="Link" size={20} />
            </button>
          ))}
        </div>
        <p className="footer__copy">© 2026 ЗВУК · Все права защищены</p>
      </footer>

      {/* GALLERY MODAL */}
      {galleryModal !== null && (
        <div className="modal-overlay" onClick={() => setGalleryModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setGalleryModal(null)}>
              <Icon name="X" size={24} />
            </button>
            <img src={galleryItems[galleryModal].img} alt={galleryItems[galleryModal].label} />
            <p className="modal-label">{galleryItems[galleryModal].label}</p>
            <div className="modal-nav">
              <button onClick={() => setGalleryModal((galleryModal - 1 + galleryItems.length) % galleryItems.length)}>
                <Icon name="ChevronLeft" size={20} />
              </button>
              <span>{galleryModal + 1} / {galleryItems.length}</span>
              <button onClick={() => setGalleryModal((galleryModal + 1) % galleryItems.length)}>
                <Icon name="ChevronRight" size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {payTicket && (
        <TicketPayModal ticket={payTicket} onClose={() => setPayTicket(null)} />
      )}
    </div>
  );
}