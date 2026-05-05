import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order_number");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="success-page">
      <div className="success-noise" />
      <div className={`success-card ${visible ? "success-card--visible" : ""}`}>
        <div className="success-icon">
          <Icon name="CheckCircle" size={56} />
        </div>
        <div className="success-eyebrow">Оплата прошла</div>
        <h1 className="success-title">Билет<br /><em>твой!</em></h1>
        <p className="success-desc">
          Электронный билет уже отправлен на твой email.
          Проверь входящие — иногда письмо попадает в «Спам».
        </p>
        {orderNumber && (
          <div className="success-order">
            <span className="success-order__label">Номер заказа</span>
            <span className="success-order__num">{orderNumber}</span>
          </div>
        )}
        <div className="success-facts">
          {[
            { icon: "MapPin", text: "Stadium Live, Москва" },
            { icon: "Calendar", text: "15 августа 2026, 20:00" },
            { icon: "Mail", text: "Билет придёт на email" },
          ].map(({ icon, text }) => (
            <div className="success-fact" key={text}>
              <Icon name={icon} fallback="Circle" size={16} />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <a href="/" className="success-btn">
          Вернуться на сайт
        </a>
      </div>

      <style>{`
        .success-page {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          font-family: 'IBM Plex Mono', monospace;
        }
        .success-noise {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 40%, rgba(255,61,0,0.12) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 70%, rgba(0,229,255,0.06) 0%, transparent 50%);
        }
        .success-card {
          position: relative;
          background: #111;
          border: 1px solid rgba(255,255,255,0.08);
          border-top: 3px solid #FF3D00;
          max-width: 480px;
          width: 100%;
          padding: 56px 48px;
          text-align: center;
          opacity: 0;
          transform: translateY(32px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .success-card--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .success-icon {
          color: #FF3D00;
          margin-bottom: 24px;
          animation: pulse-icon 2s ease infinite;
        }
        @keyframes pulse-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .success-eyebrow {
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #FF3D00;
          margin-bottom: 12px;
        }
        .success-title {
          font-family: 'Oswald', sans-serif;
          font-size: 72px;
          font-weight: 700;
          color: #f0ede6;
          line-height: 0.95;
          margin-bottom: 24px;
        }
        .success-title em {
          font-style: italic;
          font-family: 'Cormorant', serif;
          font-weight: 300;
          color: rgba(240,237,230,0.45);
        }
        .success-desc {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(240,237,230,0.5);
          margin-bottom: 32px;
        }
        .success-order {
          background: #181818;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 16px 24px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .success-order__label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.35);
        }
        .success-order__num {
          font-size: 18px;
          font-weight: 600;
          color: #f0ede6;
          letter-spacing: 0.05em;
        }
        .success-facts {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
          text-align: left;
        }
        .success-fact {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(240,237,230,0.5);
        }
        .success-fact svg { color: #FF3D00; flex-shrink: 0; }
        .success-btn {
          display: block;
          background: #FF3D00;
          color: #fff;
          font-family: 'Oswald', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 16px 40px;
          transition: all 0.25s;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }
        .success-btn:hover {
          background: #ff5722;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(255,61,0,0.4);
        }
      `}</style>
    </div>
  );
}
