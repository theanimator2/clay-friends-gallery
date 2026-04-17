const SUPABASE_URL = "https://npwhelvbttofggdlksvx.supabase.co";
const SUPABASE_KEY = "sb_publishable_Kpecgl2xvzqGOckTcUKtjg_k1xe11JL";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const { data, error } = await db
    .from("clay_friends")
    .select("*")
    .order("number", { ascending: false });

  if (error) {
    console.error("Gallery load failed:", error);
    gallery.innerHTML = "<div style='padding:20px;'>Failed to load gallery.</div>";
    return;
  }

  gallery.innerHTML = "";

  for (const item of data) {
    const a = document.createElement("a");
    a.className = "tile";
    a.href = `friend.html?number=${item.number}`;

    const img = document.createElement("img");
    img.src = item.image_url;
    img.alt = `Clay Friend #${item.number}`;

    const num = document.createElement("div");
    num.className = "hover-number";
    num.textContent = `Clay Friend #${item.number}`;

    a.appendChild(img);
    a.appendChild(num);
    gallery.appendChild(a);
  }
}

async function loadFriendPage() {
  const title = document.getElementById("title");
  const image = document.getElementById("friend-image");
  const button = document.getElementById("download-btn");
  if (!title || !image || !button) return;

  const params = new URLSearchParams(window.location.search);
  const number = params.get("number");

  if (!number) {
    title.textContent = "Clay Friend not found";
    return;
  }

  const { data, error } = await db
    .from("clay_friends")
    .select("*")
    .eq("number", Number(number))
    .single();

  if (error || !data) {
    console.error("Friend load failed:", error);
    title.textContent = "Clay Friend not found";
    return;
  }

  title.textContent = `Clay Friend #${data.number}`;
  image.src = data.image_url;
  image.alt = `Clay Friend #${data.number}`;

  button.onclick = async () => {
    const response = await fetch(data.image_url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `clay-friend-${data.number}.png`;
    link.click();

    URL.revokeObjectURL(blobUrl);
  };
}
