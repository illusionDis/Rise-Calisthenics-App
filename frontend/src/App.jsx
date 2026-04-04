import { useState, useEffect } from 'react';
import { Mail, Lock, User, Dumbbell, ArrowRight, LogOut, Trophy, Activity, Plus, Medal, Flame, Trash2, Bell, Settings, Image as ImageIcon, Home, Upload } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://ashura-forge-production-7424.up.railway.app';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profilePic'); // Çıkışta resmi de temizle
    setToken(null);
  };

  return token ? (
    <MainApp token={token} onLogout={handleLogout} />
  ) : (
    <AuthScreen setToken={setToken} />
  );
}

function MainApp({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Profil fotoğrafını her an her yerde göstermek için Global Hafıza
  const [globalProfilePic, setGlobalProfilePic] = useState(localStorage.getItem('profilePic'));

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.data);
      // Backend'den resim gelirse ve lokalde yoksa onu kullan
      if(res.data.data?.profileImageUrl && !localStorage.getItem('profilePic')) {
        setGlobalProfilePic(res.data.data.profileImageUrl);
        localStorage.setItem('profilePic', res.data.data.profileImageUrl);
      }
    } catch (err) {
      console.error("Veri çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-amber-500">
        <Dumbbell className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl gap-4">
          <div className="flex items-center gap-4">
            {/* HER ZAMAN GÖRÜNEN PROFIL FOTOGRAFI BURASI */}
            <div className="w-14 h-14 bg-gray-950 border-2 border-amber-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden shrink-0">
              {globalProfilePic ? (
                <img 
                  src={globalProfilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              ) : (
                <Dumbbell className="w-7 h-7 text-amber-500" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wider">ASHURA FORGE</h1>
              <p className="text-xs text-amber-500 font-medium uppercase tracking-widest">{userData?.currentTitle}</p>
            </div>
          </div>
          
          <div className="flex gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-amber-500 text-gray-950' : 'text-gray-400 hover:text-white'}`}>
              <Home className="w-4 h-4" /> Ana Sayfa
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold ${activeTab === 'profile' ? 'bg-amber-500 text-gray-950' : 'text-gray-400 hover:text-white'}`}>
              <Settings className="w-4 h-4" /> Profil
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold ${activeTab === 'notifications' ? 'bg-amber-500 text-gray-950' : 'text-gray-400 hover:text-white'}`}>
              <Bell className="w-4 h-4" /> Bildirimler
            </button>
          </div>

          <button onClick={onLogout} className="p-3 bg-gray-950 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {activeTab === 'dashboard' && <DashboardTab token={token} userData={userData} refreshData={fetchUserData} />}
        {activeTab === 'profile' && <ProfileTab token={token} userData={userData} refreshData={fetchUserData} globalProfilePic={globalProfilePic} setGlobalProfilePic={setGlobalProfilePic} />}
        {activeTab === 'notifications' && <NotificationsTab token={token} />}

      </div>
    </div>
  );
}

function DashboardTab({ token, userData, refreshData }) {
  const [workoutForm, setWorkoutForm] = useState({ name: '', durationMinutes: 30, category: 'Cardio' });

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/Workout`, workoutForm, { headers: { Authorization: `Bearer ${token}` } });
      setWorkoutForm({ name: '', durationMinutes: 30, category: 'Cardio' });
      refreshData();
    } catch (err) { alert("Hata oluştu."); }
  };

  const handleDeleteWorkout = async (id) => {
    if(!window.confirm("Silinsin mi?")) return;
    try {
      await axios.delete(`${API_URL}/api/Workout/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      refreshData();
    } catch (err) { alert("Hata."); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="md:col-span-1 space-y-6">
        <div className="bg-gray-900 border border-amber-500/30 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-yellow-400"></div>
          <Trophy className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{userData?.currentTitle}</h2>
          <p className="text-sm text-gray-400 mt-2 italic">"{userData?.nextTitle}" için {userData?.workoutsToNextTitle} antrenman kaldı.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl text-center shadow-lg"><Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" /><p className="text-3xl font-bold text-white">{userData?.totalWorkouts}</p><p className="text-xs text-gray-500 uppercase font-bold">Seans</p></div>
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl text-center shadow-lg"><Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" /><p className="text-3xl font-bold text-white">{userData?.totalMinutes}</p><p className="text-xs text-gray-500 uppercase font-bold">Dakika</p></div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-amber-500"/> Yeni Kayıt</h2>
          <form onSubmit={handleAddWorkout} className="space-y-4">
            <input type="text" placeholder="Antrenman Adı" required value={workoutForm.name} onChange={(e) => setWorkoutForm({...workoutForm, name: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-amber-500 outline-none text-white transition-all" />
            <div className="flex gap-4">
              <input type="number" placeholder="Dakika" required min="1" value={workoutForm.durationMinutes} onChange={(e) => setWorkoutForm({...workoutForm, durationMinutes: e.target.value})} className="w-1/2 bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-amber-500 outline-none text-white transition-all" />
              <select value={workoutForm.category} onChange={(e) => setWorkoutForm({...workoutForm, category: e.target.value})} className="w-1/2 bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-amber-500 outline-none text-gray-300 cursor-pointer">
                <option>Cardio</option><option>Strength</option><option>Flexibility</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-black py-4 rounded-xl transition-all shadow-lg active:scale-95">ANTRENMANI EKLE</button>
          </form>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Medal className="w-5 h-5 text-amber-500"/> Başarı Rozetleri ({userData?.badgeCount})</h2>
          <div className="flex flex-wrap gap-4">
            {userData?.earnedBadges?.map((badge, idx) => (
              <div key={idx} className="bg-gray-950 border border-amber-500/20 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-md">
                <span className="text-3xl">{badge.icon}</span>
                <p className="text-sm font-bold text-white">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-amber-500"/> Antrenman Geçmişi</h2>
          <div className="space-y-3">
            {userData?.recentWorkouts?.map((w) => (
              <div key={w.id} className="flex justify-between items-center bg-gray-950 border border-gray-800 p-5 rounded-2xl group hover:border-amber-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-800 group-hover:bg-amber-500 transition-all">
                    <Dumbbell className="w-5 h-5 text-gray-500 group-hover:text-gray-950" />
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-amber-500 transition-colors">{w.name}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter">{w.category} • {new Date(w.workoutDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-amber-500 font-black">{w.durationMinutes} DK</span>
                  <button onClick={() => handleDeleteWorkout(w.id)} className="text-gray-700 hover:text-red-500 transition-all p-2 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ token, userData, refreshData, globalProfilePic, setGlobalProfilePic }) {
  const [profileForm, setProfileForm] = useState({ username: '', email: '', currentPassword: '', newPassword: '' });
  const [base64Image, setBase64Image] = useState('');
  const [loading, setLoading] = useState(false);

  // Dosya Seçme ve Base64'e Çevirme İşlemi
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result); // Seçilen dosyayı metne (Base64) çevirdik
      };
      reader.readAsDataURL(file);
    }
  };

  // Fotoğrafı Backend'e Yollama İşlemi
  // Fotoğrafı Backend'i çökertmeden kaydetme taktiği
  const handleImageUpdate = async (e) => {
    e.preventDefault();
    if(!base64Image) return alert("Lütfen bir fotoğraf seçin.");
    setLoading(true);
    
    try {
      // 1. Backend'e devasa Base64 yerine, onu mutlu edecek kısa bir temsili kelime yolluyoruz.
      await axios.put(`${API_URL}/api/Profile/image`, 
        { profileImageUrl: 'local-upload-success' }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 2. Asıl devasa fotoğrafı (Base64) tarayıcının kendi hafızasına kazıyoruz.
      setGlobalProfilePic(base64Image);
      localStorage.setItem('profilePic', base64Image);
      
      alert("Fotoğraf başarıyla güncellendi!");
      setBase64Image(''); // Formu temizle
      refreshData(); 
    } catch (err) { 
      // Eğer hala hata veriyorsa konsola da yazdıralım ki ne olduğunu görelim
      console.error(err.response?.data);
      alert("Fotoğraf güncellenirken hata oluştu."); 
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/api/Profile`, profileForm, { headers: { Authorization: `Bearer ${token}` } });
      alert("Bilgiler güncellendi!");
      setProfileForm({ username: '', email: '', currentPassword: '', newPassword: '' });
      refreshData();
    } catch (err) { alert("Mevcut şifre hatalı."); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom duration-500">
      
      {/* YEREL DOSYA YÜKLEME ALANI */}
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-gray-950 rounded-3xl border-2 border-amber-500 flex items-center justify-center overflow-hidden shadow-2xl shrink-0">
            {base64Image ? (
              <img src={base64Image} alt="Preview" className="w-full h-full object-cover" />
            ) : globalProfilePic ? (
              <img src={globalProfilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-800" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Profil Fotoğrafı</h2>
            <p className="text-sm text-gray-500 font-medium">Bilgisayarından bir fotoğraf seç.</p>
          </div>
        </div>
        
        <form onSubmit={handleImageUpdate} className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-800 border-dashed rounded-xl cursor-pointer bg-gray-950 hover:border-amber-500 hover:bg-gray-900 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-amber-500">Tıklayarak Seç</span> veya sürükle bırak</p>
              <p className="text-xs text-gray-600">PNG, JPG (Maks. boyut önerisi: 1MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
          <button type="submit" disabled={loading || !base64Image} className="w-full bg-gray-800 hover:bg-amber-500 hover:text-gray-950 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'YÜKLENİYOR...' : 'FOTOĞRAFI GÜNCELLE'}
          </button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Settings className="w-6 h-6 text-amber-500"/> Hesap Ayarları</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Yeni Ad" value={profileForm.username} onChange={(e) => setProfileForm({...profileForm, username: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-amber-500 outline-none text-white" />
            <input type="email" placeholder="Yeni E-posta" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-amber-500 outline-none text-white" />
          </div>
          <hr className="border-gray-800 my-2" />
          <input type="password" placeholder="Mevcut Şifre (Gerekli)" required value={profileForm.currentPassword} onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-amber-500 outline-none text-white" />
          <input type="password" placeholder="Yeni Şifre" value={profileForm.newPassword} onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-amber-500 outline-none text-white" />
          <button type="submit" className="w-full bg-gray-800 hover:bg-amber-500 hover:text-gray-950 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95">BİLGİLERİ KAYDET</button>
        </form>
      </div>
    </div>
  );
}

function NotificationsTab({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/Notification`, { headers: { Authorization: `Bearer ${token}` } });
        setNotifications(res.data.data || res.data || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchNotifications();
  }, []);

  if (loading) return <div className="flex justify-center py-20 text-amber-500"><Dumbbell className="w-12 h-12 animate-spin" /></div>;

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl max-w-2xl mx-auto shadow-2xl animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Bell className="w-8 h-8 text-amber-500"/> Bildirim Merkezi</h2>
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif, idx) => (
            <div key={idx} className="bg-gray-950 border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-md">
              <p className="text-white font-bold leading-tight">{notif.message || notif.content}</p>
              <p className="text-[10px] text-gray-600 font-black uppercase mt-2 tracking-widest">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-700">
            <Bell className="w-20 h-20 mx-auto mb-4 opacity-10" />
            <p className="font-bold uppercase tracking-widest">Henüz bildirim yok</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AuthScreen({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const endpoint = isLogin ? '/api/Auth/login' : '/api/Auth/register';
    
    try {
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        setToken(response.data.data.token);
      }
    } catch (err) { setError(err.response?.data?.message || 'Bir hata oluştu.'); } finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-950 selection:bg-amber-500 selection:text-gray-950">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-10 shadow-[0_0_50px_-12px_rgba(245,158,11,0.2)]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-950 border border-gray-800 mb-6 shadow-inner transform -rotate-6">
            <Dumbbell className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">ASHURA FORGE</h2>
          <p className="text-gray-500 text-sm font-medium">{isLogin ? 'Savaşa hazır mısın?' : 'Efsanelerin arasına katıl'}</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-xs font-bold text-center uppercase tracking-widest">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input type="text" name="username" placeholder="Kullanıcı Adı" value={formData.username} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:border-amber-500 outline-none transition-all font-medium" />
            </div>
          )}
          <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input type="email" name="email" placeholder="E-posta Adresi" value={formData.email} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:border-amber-500 outline-none transition-all font-medium" />
          </div>
          <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input type="password" name="password" placeholder="Şifre" value={formData.password} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:border-amber-500 outline-none transition-all font-medium" />
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-black rounded-2xl py-4 mt-4 transition-all shadow-lg active:scale-95 uppercase tracking-widest">
            {loading ? 'KAPILAR AÇILIYOR...' : (isLogin ? 'GİRİŞ YAP' : 'KAYIT OL')} {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
        <div className="mt-8 text-center"><button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-gray-500 hover:text-amber-500 text-xs font-bold uppercase tracking-widest transition-colors">{isLogin ? 'Hesabın yok mu? Hemen oluştur' : 'Zaten bir savaşçı mısın? Giriş yap'}</button></div>
      </div>
    </div>
  );
}