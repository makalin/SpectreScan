# SpectreScan

SpectreScan is a powerful mobile-first application designed to detect hidden cameras using infrared (IR) light reflections and advanced image processing techniques.

![SpectreScan Logo](./logo.png)

## 🔍 Features

* 📷 **IR Reflection Detection:** Identify hidden lenses by detecting IR light bounces.
* 💡 **Smart Lens Reflection Analysis:** Advanced glint detection filters out false positives.
* 🔬 **LIDAR Anomaly Scanning:** (Pro models) Use LIDAR to detect protrusions on flat surfaces.
* 📲 **Mobile Friendly:** Optimized for both Android and iOS devices.
* ✨ **Dark Mode UI:** For discreet usage in low-light environments.

## 🚀 Installation

```bash
git clone https://github.com/makalin/SpectreScan.git
cd SpectreScan
```

For mobile setup, open the project in your preferred IDE:

* Android: Android Studio
* iOS: Xcode

Install dependencies:

```bash
npm install
# or
yarn install
```

## 📊 Tech Stack

* **Frontend:** React Native
* **Image Processing:** OpenCV
* **Machine Learning:** TensorFlow Lite (for glint classification)
* **Optional:** ARKit / LIDAR SDK (iOS Pro models)

## 📝 Usage

1. Launch the app.
2. Dim the lights for optimal detection.
3. Press 'Start Scan' and slowly sweep your camera across the room.
4. Marked reflections and anomalies will be highlighted.

## 🔧 Project Structure

```
SpectreScan/
├── assets/            # Logos, Icons
├── src/
│   ├── components/     # UI Components
│   ├── services/      # IR and LIDAR services
│   └── utils/          # Helper functions
├── README.md
└── package.json
```

## 🙌 Contributing

We welcome contributions!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 💪 License

MIT License. See [LICENSE](./LICENSE) for more information.

---

**SpectreScan** - Reveal the unseen. 🔮
