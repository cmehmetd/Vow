# Vow

Vow, aktif sekmeden gelen video, ses ve altyazı medya isteklerini algılayan bir Chromium MV3 eklentisidir. Yerel olarak çalışır ve harici bir sunucu, analiz veya telemetri kullanmaz.

## Proje Yapısı

```text
Vow/
├─ manifest.json
├─ background.js
├─ detector.js
├─ popup.html
├─ popup.css
├─ popup.js
├─ icons/
│  ├─ icon-16x16.png
│  ├─ icon-32x32.png
│  ├─ icon-192x192.png
│  └─ icon-512x512.png
├─ README.md
└─ AGENTS.md
```

## Özellikler

- HLS/M3U8 ana ve medya çalma listelerini algılar.
- `.vtt`, `.srt`, `.ass`, `.ssa` dosyalarını ve altyazı oynatma listesi isteklerini algılar.
- Sonuçları  "Video", "Ses" veya "Altyazı" olarak sınıflandırır.
- Sekme başına yinelenen URL'leri önler.
- Oynatma sırasında yeni istekler geldiğinde açılır pencereyi günceller.

## Kullanılan MV3 izinleri

- `webRequest`: İstek URL'lerini ve yanıt başlıklarını inceler.
- `tabs`: Etkin sekmenin kimliğini/başlığını okur ve etkin sayfayı yeniden yükler.
- `storage`: Sonuçları kaydeder ve servis çalışanı ile açılır pencere arasında paylaşır.
- `host_permissions: ["<all_urls>"]`: Ziyaret edilen sitelerdeki HTTP(s) isteklerinin izlenmesine olanak tanır.

Vow, `webRequest`'i yalnızca gözlem amacıyla kullanır. İstekleri engellemez veya değiştirmez ve yanıt gövdelerini okumaz. Yanıt başlıkları kullanılamıyorsa, URL ve istek bağlamı sinyalleri kullanılabilir durumda kalır.

## Güvenlik

Vow, DRM şifresini çözmez, lisans anahtarlarını çıkarmaz, şifrelemeyi kırmaz veya erişim kontrollerini atlamaz. Yalnızca tarayıcı tarafından normalde yapılan medya ve altyazı HTTP(S) isteklerini sınıflandırır.

## Kurulum

1. `chrome://extensions` sayfasını girin.
2. Geliştirici Modu'nu etkinleştirin.
3. `Paketlenmemiş Öğe Yükle` Butonuna tıklayın.
4. Eklenti klasörünü seçin..

Reload the extension from the extensions page after changing source files or icons.
