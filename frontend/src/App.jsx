import { useState, useEffect } from 'react';
import { Mail, Lock, User, Dumbbell, ArrowRight, LogOut, Trophy, Activity, Plus, Medal, Flame } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://ashura-forge-production-7424.up.railway.app';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Çıkış Yapma Fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Eğer token varsa Dashboard'u (Ana Sayfayı) göster, yoksa Auth (Giriş) ekranını göster
  return token ? (
    <Dashboard token={token} onLogout={handleLogout} />
  ) : (
    <AuthScreen setToken={setToken} />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANA SAYFA (DASHBOARD) EKRANI
   ───────────────────────────────────────────────────────────────────────────── */
function Dashboard({ token, onLogout }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutForm, setWorkoutForm] = useState({ name: '', durationMinutes: 30, category: 'Cardio' });

  // İstatistikleri Backend'den Çek (Gereksinim 9-10)
  const fetchProgress = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgress(res.data.data);
    } catch (err) {
      console.error("Veri çekilemedi", err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa açıldığında verileri getir
  useEffect(() => {
    fetchProgress();
  }, []);

  // Yeni Antrenman Ekleme (Gereksinim 3)
  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/Workout`, workoutForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkoutForm({ name: '', durationMinutes: 30, category: 'Cardio' }); // Formu sıfırla
      fetchProgress(); // Verileri (Unvan, Rozet vs.) yenile
    } catch (err) {
      alert("Antrenman eklenirken hata oluştu!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-amber-500"><Dumbbell className="w-12 h-12 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Üst Bar (Header) */}
        <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-950 border-2 border-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{progress?.currentTitle || 'Savaşçı'}</h1>
              <p className="text-gray-400 text-sm">Bir sonraki unvan: <span className="text-amber-500 font-semibold">{progress?.nextTitle}</span> ({progress?.workoutsToNextTitle} antrenman kaldı)</p>
            </div>
          </div>
          <button onClick={onLogout} className="p-3 bg-gray-950 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Kolon: İstatistikler ve Form */}
          <div className="md:col-span-1 space-y-8">
            
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl text-center">
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{progress?.totalWorkouts}</p>
                <p className="text-xs text-gray-400">Antrenman</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl text-center">
                <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{progress?.totalMinutes}</p>
                <p className="text-xs text-gray-400">Dakika</p>
              </div>
            </div>

            {/* Antrenman Ekleme Kartı */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-amber-500"/> Antrenman Ekle</h2>
              <form onSubmit={handleAddWorkout} className="space-y-4">
                <input 
                  type="text" placeholder="Örn: 100 Şınav" required
                  value={workoutForm.name} onChange={(e) => setWorkoutForm({...workoutForm, name: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none"
                />
                <div className="flex gap-4">
                  <input 
                    type="number" placeholder="Süre (dk)" required min="1"
                    value={workoutForm.durationMinutes} onChange={(e) => setWorkoutForm({...workoutForm, durationMinutes: e.target.value})}
                    className="w-1/2 bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none"
                  />
                  <select 
                    value={workoutForm.category} onChange={(e) => setWorkoutForm({...workoutForm, category: e.target.value})}
                    className="w-1/2 bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none text-gray-300"
                  >
                    <option>Cardio</option>
                    <option>Strength</option>
                    <option>Flexibility</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 rounded-xl transition-colors">
                  Kaydet
                </button>
              </form>
            </div>
          </div>

          {/* Sağ Kolon: Rozetler ve Geçmiş */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Kazanılan Rozetler */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Medal className="w-5 h-5 text-amber-500"/> Kazanılan Rozetler ({progress?.badgeCount})</h2>
              {progress?.earnedBadges?.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {progress.earnedBadges.map((badge, idx) => (
                    <div key={idx} className="bg-gray-950 border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-2">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{badge.name}</p>
                        <p className="text-xs text-amber-500/70">Kazanıldı</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Henüz rozet kazanmadın. Antrenman yapmaya başla!</p>
              )}
            </div>

            {/* Son Antrenmanlar Geçmişi */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-amber-500"/> Son Antrenmanlar</h2>
              <div className="space-y-3">
                {progress?.recentWorkouts?.length > 0 ? (
                  progress.recentWorkouts.map((w, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-950 border border-gray-800 p-4 rounded-xl">
                      <div>
                        <p className="font-bold text-white">{w.name}</p>
                        <p className="text-xs text-gray-400">{w.category} • {new Date(w.workoutDate).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div className="text-amber-500 font-bold">{w.durationMinutes} dk</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Hiç antrenman kaydın yok.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GİRİŞ / KAYIT EKRANI (AuthScreen)
   ───────────────────────────────────────────────────────────────────────────── */
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
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
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
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="text" name="username" placeholder="Kullanıcı Adı" value={formData.username} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="email" name="email" placeholder="E-posta Adresi" value={formData.email} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500 transition-colors" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="password" name="password" placeholder="Şifre" value={formData.password} onChange={handleChange} required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500 transition-colors" />
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl py-3 transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Sisteme Bağlanılıyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
            {isLogin ? 'Hesabın yok mu? Hemen kayıt ol' : 'Zaten bir hesabın var mı? Giriş yap'}
          </button>
        </div>
      </div>
    </div>
  );
}