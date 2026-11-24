import { useEffect, useRef, useState } from "react";
import "./App.css";

/* ============================================================
   1) EDIT DATA & ASSET DI SINI SAJA
   Taruh gambar di folder: public/assets/
   ============================================================ */
const asset = (file) => `/assets/${file}`;

const DATA = {
  groom: { nick: "Tommy", full: "Tommy Lim, S.E", parents: "Putra pertama dari Bpk. Lim Tiong Giap & Ibu Wang Cen-Cen" },
  bride: { nick: "Felia", full: "Felia, S.Kom", parents: "Putri ketiga dari Bpk. Oh Ching Ti & Ibu Lim Fie Yen" },
  date: "2026-06-26T09:00:00+07:00", // untuk countdown
  dateText: "Jumat, 26 Juni 2026",
  quote:
    "Tulis kutipan atau kata pembuka undangan kalian di sini.",
  events: [
    {
      title: "Akad",
      time: "09.00 WIB",
      place: "Nama Tempat ",
      address: "Alamat lengkap tempat ",
      map: "https://maps.google.com",
    },
    {
      title: "Resepsi",
      time: "10.00 – 14.00 WIB",
      place: "Nama Tempat Resepsi",
      address: "Alamat lengkap tempat resepsi",
      map: "https://maps.google.com",
    },
  ],
  gallery: ["g1.jpg", "g2.jpg", "g3.jpg", "g4.jpg", "g5.jpg", "g6.jpg"],
  gifts: [
    { bank: "BCA", number: "1234567890", name: "Nama Pemilik" },
    { bank: "ShopeePay", number: "08123456789", name: "Nama Pemilik" },
  ],
  whatsapp: "6281234567890", // nomor tujuan RSVP (format 62...)
  intro: {
    video: asset("istana.mp4"),
    textAt: 5, // detik ke berapa tulisan "The Wedding Of" muncul (saat sudah di dalam istana)
  },
  music: asset("Musik.mp3"),
  img: {
    side: asset("side.png"), // background sisi kiri (desktop)
    cover: asset("cover.webp"), // background cover "Buka Undangan"
    groom: asset("groom.png"),
    bride: asset("bride.png"),
    divider: asset("ornament.png"), // ornamen pemisah (opsional)
  },
};

/* ============================================================
   2) KOMPONEN
   ============================================================ */
const bg = (url) => ({ backgroundImage: `url(${url})` });

function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, new Date(target) - new Date());
    return {
      Hari: Math.floor(diff / 864e5),
      Jam: Math.floor(diff / 36e5) % 24,
      Menit: Math.floor(diff / 6e4) % 60,
      Detik: Math.floor(diff / 1e3) % 60,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function Divider() {
  return <div className="divider" style={bg(DATA.img.divider)} aria-hidden="true" />;
}

function Cover({ guest, onOpen }) {
  return (
    <div className="cover" style={bg(DATA.img.cover)}>
      <div className="cover-inner">
        <p className="small">Undangan Pernikahan</p>
        <h1 className="names">
          {DATA.groom.nick} <span>&amp;</span> {DATA.bride.nick}
        </h1>
        <p className="small">Kepada Yth.</p>
        <p className="guest">{guest}</p>
        <button className="btn" onClick={onOpen}>
          Buka Undangan
        </button>
      </div>
    </div>
  );
}

function Hero({ showText }) {
  return (
    <section className={`sec hero ${showText ? "text-on" : ""}`}>
      <div className="hero-inner">
        <p className="small">The Wedding Of</p>
        <h2 className="names">
          {DATA.groom.nick} <span>&amp;</span> {DATA.bride.nick}
        </h2>
        <p className="date">{DATA.dateText}</p>
        <span className="hint" aria-hidden="true">↓</span>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="sec paper">
      <Divider />
      <p className="quote">{DATA.quote}</p>
    </section>
  );
}

function Person({ p, img }) {
  return (
    <div className="person">
      <div className="photo" style={bg(img)} />
      <h3>{p.nick}</h3>
      <p className="full">{p.full}</p>
      <p className="parents">{p.parents}</p>
    </div>
  );
}

function Couple() {
  return (
    <section className="sec paper">
      <h2 className="title">Mempelai</h2>
      <Person p={DATA.groom} img={DATA.img.groom} />
      <p className="amp">&amp;</p>
      <Person p={DATA.bride} img={DATA.img.bride} />
    </section>
  );
}

function Countdown() {
  const t = useCountdown(DATA.date);
  return (
    <section className="sec dark">
      <h2 className="title">Menuju Hari Bahagia</h2>
      <div className="count">
        {Object.entries(t).map(([label, val]) => (
          <div key={label}>
            <b>{String(val).padStart(2, "0")}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Events() {
  return (
    <section className="sec paper">
      <h2 className="title">Acara</h2>
      {DATA.events.map((e) => (
        <article className="event" key={e.title}>
          <h3>{e.title}</h3>
          <p className="date">{DATA.dateText}</p>
          <p>{e.time}</p>
          <p className="place">{e.place}</p>
          <p className="parents">{e.address}</p>
          <a className="btn ghost" href={e.map} target="_blank" rel="noreferrer">
            Lihat Lokasi
          </a>
        </article>
      ))}
    </section>
  );
}

function Gallery() {
  return (
    <section className="sec dark">
      <h2 className="title">Momen Kami</h2>
      <div className="grid">
        {DATA.gallery.map((f) => (
          <div key={f} className="cell" style={bg(asset(f))} />
        ))}
      </div>
    </section>
  );
}

function Gift() {
  const [copied, setCopied] = useState("");
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      /* clipboard tidak tersedia */
    }
  };
  return (
    <section className="sec paper">
      <h2 className="title">Hadiah</h2>
      {DATA.gifts.map((g) => (
        <div className="gift" key={g.bank}>
          <h3>{g.bank}</h3>
          <p className="num">{g.number}</p>
          <p className="parents">a/n {g.name}</p>
          <button className="btn ghost" onClick={() => copy(g.number)}>
            {copied === g.number ? "Tersalin" : "Salin nomor"}
          </button>
        </div>
      ))}
    </section>
  );
}

function Rsvp() {
  const [f, setF] = useState({ name: "", attend: "Hadir", count: 1, wish: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = (e) => {
    e.preventDefault();
    const msg = `Halo, saya ${f.name}.%0AKonfirmasi: ${f.attend} (${f.count} orang)%0AUcapan: ${f.wish}`;
    window.open(`https://wa.me/${DATA.whatsapp}?text=${msg}`, "_blank");
  };
  return (
    <section className="sec dark">
      <h2 className="title">Konfirmasi Kehadiran</h2>
      <form className="form" onSubmit={send}>
        <input required placeholder="Nama" value={f.name} onChange={set("name")} />
        <select value={f.attend} onChange={set("attend")}>
          <option>Hadir</option>
          <option>Tidak hadir</option>
        </select>
        <input type="number" min="1" max="10" value={f.count} onChange={set("count")} aria-label="Jumlah tamu" />
        <textarea rows="3" placeholder="Ucapan & doa" value={f.wish} onChange={set("wish")} />
        <button className="btn" type="submit">
          Kirim lewat WhatsApp
        </button>
      </form>
      <p className="foot">
        {DATA.groom.nick} &amp; {DATA.bride.nick}
      </p>
    </section>
  );
}

/* ============================================================
   3) APP: sisi kiri (desktop saja) + sisi kanan (isi undangan)
   ============================================================ */
export default function App() {
  const [opened, setOpened] = useState(false);
  const [showText, setShowText] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);
  const video = useRef(null);
  const guest = new URLSearchParams(window.location.search).get("to") || "Tamu Undangan";

  // Tinggi layar asli (browser HP lama tidak paham 100dvh)
  useEffect(() => {
    const setH = () => document.documentElement.style.setProperty("--app-h", `${window.innerHeight}px`);
    setH();
    window.addEventListener("resize", setH);
    window.addEventListener("orientationchange", setH);
    return () => {
      window.removeEventListener("resize", setH);
      window.removeEventListener("orientationchange", setH);
    };
  }, []);

  const open = () => {
    setOpened(true);
    const v = video.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => setShowText(true)); // kalau video gagal, tulisan tetap muncul
    }
    audio.current?.play().then(() => setPlaying(true)).catch(() => {});
  };
  const toggleMusic = () => {
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else audio.current.play().catch(() => {});
    setPlaying(!playing);
  };
  const onTime = () => {
    if (video.current && video.current.currentTime >= DATA.intro.textAt) setShowText(true);
  };

  return (
    <div className="stage">
      {/* SISI KIRI: hanya tampil di layar lebar */}
      <aside className="side" style={bg(DATA.img.side)}>
        <div className="side-inner">
          <p className="small">The Wedding Of</p>
          <h1 className="names">
            {DATA.groom.nick} <span>&amp;</span> {DATA.bride.nick}
          </h1>
          <p className="date">{DATA.dateText}</p>
        </div>
      </aside>

      {/* SISI KANAN: tampilan "HP" (full layar di mobile) */}
      <main className="phone">
        {/* Video istana: diam di belakang, tidak loop, berhenti di frame terakhir */}
        <video
          ref={video}
          className="bg-video"
          src={DATA.intro.video}
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5-page"
          x5-video-player-fullscreen="false"
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
          onContextMenu={(e) => e.preventDefault()}
          preload="auto"
          onTimeUpdate={onTime}
          onEnded={() => setShowText(true)}
          onError={() => setShowText(true)}
        />
        {!opened && <Cover guest={guest} onOpen={open} />}
        <div className={`scroll ${opened ? "" : "locked"}`}>
          <Hero showText={showText} />
          <Quote />
          <Couple />
          <Countdown />
          <Events />
          <Gallery />
          <Gift />
          <Rsvp />
        </div>
        {opened && (
          <button className="music" onClick={toggleMusic} aria-label={playing ? "Matikan musik" : "Putar musik"}>
            {playing ? "❚❚" : "▶"}
          </button>
        )}
        <audio ref={audio} src={DATA.music} loop preload="auto" />
      </main>
    </div>
  );
}
