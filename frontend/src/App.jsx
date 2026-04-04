import { useState, useEffect } from 'react';
import { Mail, Lock, User, Dumbbell, ArrowRight, LogOut, Trophy, Activity, Plus, Medal, Flame, Trash2, Bell, Settings, Image as ImageIcon, Home } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://ashura-forge-production-7424.up.railway.app';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return token ? (
    <MainApp token={token} onLogout={handleLogout} />
  ) : (
    <AuthScreen setToken={setToken} />
  );
}

function MainApp({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | profile | notifications
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-950 border-2 border-amber-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
               <Dumbbell className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wider">ASHURA FORGE</h1>
          </div>
          
          <div className="flex gap-2 bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-amber-500 text-gray-950' : 'text-gray-400 hover:text-white'}`}>
              <Home className="w-4 h-4" /> Ana Sayfa
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'profile' ? 'bg-amber-500 text-gray-950' : 'text-gray-400 hover:text-white'}`}>
              <Settings className="w-4 h-4" /> Profil
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'notifications' ? 'bg-amber-500 text-gray-950' : 'text-gray-400 hover:text-white'}`}>
              <Bell className="w-4 h-4" /> Bildirimler
            </button>
          </div>

          <button onClick={onLogout} className="p-3 bg-gray-950 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-colors" title="Çıkış Yap">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content Render */}
        {activeTab === 'dashboard' && <DashboardTab token={token} />}
        {activeTab === 'profile' && <ProfileTab token={token} />}
        {activeTab === 'notifications' && <NotificationsTab token={token} />}

      </div>
    </div>
  );
}

/* =========================================================================
   1. DASHBOARD TAB (Req 3, 4, 5, 9, 10)
   ========================================================================= */
function DashboardTab({ token }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutForm, setWorkoutForm] = useState({ name: '', durationMinutes: 30, category: 'Cardio' });

  // Req 9 & 10: Progress & Title Tracking
  const fetchProgress = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Progress`, { headers: { Authorization: `Bearer ${token}` } });
      setProgress(res.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProgress(); }, []);

  // Req 3: Add Workout
  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/Workout`, workoutForm, { headers: { Authorization: `Bearer ${token}` } });
      setWorkoutForm({ name: '', durationMinutes: 30, category: 'Cardio' });
      fetchProgress(); // Refresh data
    } catch (err) { alert("Antrenman eklenirken hata oluştu."); }
  };

  // Req 4: Delete Workout
  const handleDeleteWorkout = async (id) => {
    if(!window.confirm("Bu antrenmanı silmek istediğine emin misin?")) return;
    try {
      await axios.delete(`${API_URL}/api/Workout/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProgress();
    } catch (err) { alert("Antrenman silinemedi."); }
  };

  // Req 5: Check Badge Manually
  const handleCheckBadges = async () => {
    try {
      await axios.patch(`${API_URL}/api/Badge/check`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("Rozet kontrolü yapıldı! Kazanılan yeni rozetler güncellendi.");
      fetchProgress();
    } catch (err) { alert("Rozet kontrolünde hata oluştu."); }
  };

  if (loading) return <div className="flex justify-center py-20 text-amber-500"><Dumbbell className="w-12 h-12 animate-spin" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Left Column: Stats & Add Workout */}
      <div className="md:col-span-1 space-y-6">
        
        {/* Title Card */}
        <div className="bg-gray-900 border border-amber-500/30 p-6 rounded-2xl text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-yellow-400"></div>
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white">{progress?.currentTitle || 'Savaşçı'}</h2>
          <p className="text-sm text-gray-400 mt-2">Sonraki Unvan: <span className="text-amber-500">{progress?.nextTitle}</span></p>
          <p className="text-xs text-gray-500">Gereken Antrenman: {progress?.workoutsToNextTitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl text-center"><Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" /><p className="text-3xl font-bold text-white">{progress?.totalWorkouts}</p><p className="text-xs text-gray-400">Antrenman</p></div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl text-center"><Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" /><p className="text-3xl font-bold text-white">{progress?.totalMinutes}</p><p className="text-xs text-gray-400">Dakika</p></div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-amber-500"/> Antrenman Ekle</h2>
          <form onSubmit={handleAddWorkout} className="space-y-4">
            <input type="text" placeholder="Örn: 100 Şınav" required value={workoutForm.name} onChange={(e) => setWorkoutForm({...workoutForm, name: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white" />
            <div className="flex gap-4">
              <input type="number" placeholder="Süre(dk)" required min="1" value={workoutForm.durationMinutes} onChange={(e) => setWorkoutForm({...workoutForm, durationMinutes: e.target.value})} className="w-1/2 bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white" />
              <select value={workoutForm.category} onChange={(e) => setWorkoutForm({...workoutForm, category: e.target.value})} className="w-1/2 bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-gray-300">
                <option>Cardio</option><option>Strength</option><option>Flexibility</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3 rounded-xl transition-colors">Kaydet</button>
          </form>
        </div>
      </div>

      {/* Right Column: Badges & History */}
      <div className="md:col-span-2 space-y-6">
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Medal className="w-5 h-5 text-amber-500"/> Rozetler ({progress?.badgeCount || 0})</h2>
            <p className="text-sm text-gray-400">Antrenman yaparak yeni rozetlerin kilitlerini aç.</p>
          </div>
          <button onClick={handleCheckBadges} className="px-4 py-2 bg-gray-950 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-gray-900 rounded-lg text-sm font-bold transition-colors">Rozetleri Kontrol Et</button>
        </div>

        {progress?.earnedBadges?.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
            <div className="flex flex-wrap gap-4">
              {progress.earnedBadges.map((badge, idx) => (
                <div key={idx} className="bg-gray-950 border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-2"><span className="text-2xl">{badge.icon}</span><div><p className="text-sm font-bold text-white">{badge.name}</p></div></div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-amber-500"/> Son Antrenmanlar</h2>
          <div className="space-y-3">
            {progress?.recentWorkouts?.length > 0 ? (
              progress.recentWorkouts.map((w) => (
                <div key={w.id} className="flex justify-between items-center bg-gray-950 border border-gray-800 p-4 rounded-xl group hover:border-amber-500/50 transition-colors">
                  <div>
                    <p className="font-bold text-white">{w.name}</p>
                    <p className="text-xs text-gray-400">{w.category} • {new Date(w.workoutDate || Date.now()).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-amber-500 font-bold">{w.durationMinutes} dk</span>
                    <button onClick={() => handleDeleteWorkout(w.id)} className="text-gray-600 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100" title="Sil">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (<p className="text-gray-500 text-sm">Hiç antrenman kaydın yok.</p>)}
          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================================================================
   2. PROFILE TAB (Req 7, 8)
   ========================================================================= */
function ProfileTab({ token }) {
  const [profileForm, setProfileForm] = useState({ username: '', email: '', currentPassword: '', newPassword: '' });
  const [imageForm, setImageForm] = useState({ profileImageUrl: '' });

  // Req 7: Change Profile Image
  const handleImageUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/Profile/image`, imageForm, { headers: { Authorization: `Bearer ${token}` } });
      alert("Profil fotoğrafı güncellendi!");
      setImageForm({ profileImageUrl: '' });
    } catch (err) { alert("Fotoğraf güncellenirken hata oluştu."); }
  };

  // Req 8: Edit Profile Info
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/api/Profile`, profileForm, { headers: { Authorization: `Bearer ${token}` } });
      alert("Profil bilgileri başarıyla güncellendi!");
      setProfileForm({ username: '', email: '', currentPassword: '', newPassword: '' });
    } catch (err) { alert("Profil güncellenirken hata oluştu. Lütfen mevcut şifrenizi kontrol edin."); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Update Image Card */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-amber-500"/> Profil Fotoğrafı Değiştir</h2>
        <form onSubmit={handleImageUpdate} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Görsel URL Adresi</label>
            <input type="url" placeholder="https://..." required value={imageForm.profileImageUrl} onChange={(e) => setImageForm({profileImageUrl: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white" />
          </div>
          <button type="submit" className="w-full bg-gray-800 hover:bg-amber-500 hover:text-gray-900 text-white font-bold py-3 rounded-xl transition-colors">Fotoğrafı Kaydet</button>
        </form>
      </div>

      {/* Update Profile Card */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-amber-500"/> Profil Bilgilerini Düzenle</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <input type="text" placeholder="Yeni Kullanıcı Adı" value={profileForm.username} onChange={(e) => setProfileForm({...profileForm, username: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white" />
          <input type="email" placeholder="Yeni E-posta" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white" />
          <hr className="border-gray-800" />
          <input type="password" placeholder="Mevcut Şifre (Zorunlu)" required value={profileForm.currentPassword} onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white" />
          <input type="password" placeholder="Yeni Şifre (Opsiyonel)" value={profileForm.newPassword} onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-white" />
          <button type="submit" className="w-full bg-gray-800 hover:bg-amber-500 hover:text-gray-900 text-white font-bold py-3 rounded-xl transition-colors">Bilgileri Güncelle</button>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   3. NOTIFICATIONS TAB (Req 6)
   ========================================================================= */
function NotificationsTab({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/Notification`, { headers: { Authorization: `Bearer ${token}` } });
        // API'nin data.data veya direkt data dönmesine göre ayarla
        setNotifications(res.data.data || res.data || []); 
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchNotifications();
  }, []);

  if (loading) return <div className="flex justify-center py-20 text-amber-500"><Dumbbell className="w-12 h-12 animate-spin" /></div>;

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Bell className="w-6 h-6 text-amber-500"/> Bildirim Merkezi</h2>
      
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif, idx) => (
            <div key={idx} className="bg-gray-950 border-l-4 border-amber-500 p-4 rounded-r-xl">
              <p className="text-white font-medium">{notif.message || notif.content}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt || Date.now()).toLocaleString('tr-TR')}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            <Bell className="w-12 h-12 text-gray-800 mx-auto mb-3" />
            <p>Şu an için yeni bir bildiriminiz yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   4. AUTH SCREEN (Req 1, 2)
   ========================================================================= */
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-950">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-950 border border-gray-800 mb-4 shadow-inner">
            <Dumbbell className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Ashura Forge</h2>
          <p className="text-gray-400 text-sm">{isLogin ? 'Hesabına giriş yap ve antrenmana başla' : 'Aramıza katıl ve efsane ol'}</p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="text" name="username" placeholder="Kullanıcı Adı" value={formData.username} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500" />
            </div>
          )}
          <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="email" name="email" placeholder="E-posta Adresi" value={formData.email} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500" />
          </div>
          <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="password" name="password" placeholder="Şifre" value={formData.password} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl py-3 mt-2">
            {loading ? 'Bağlanılıyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')} {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
        <div className="mt-6 text-center"><button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-gray-400 hover:text-amber-500 text-sm">{isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}</button></div>
      </div>
    </div>
  );
}