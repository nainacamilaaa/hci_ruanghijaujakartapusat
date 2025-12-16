import {
  FaRestroom,
  FaParking,
  FaWifi,
  FaChild,
  FaDumbbell,
  FaUmbrellaBeach,
} from "react-icons/fa";

export default function Facilities() {
  const facilities = [
    {
      icon: FaRestroom,
      title: "Toilet Umum",
      desc: "Fasilitas toilet bersih dan terawat di setiap area taman",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      icon: FaParking,
      title: "Area Parkir",
      desc: "Tempat parkir luas untuk kendaraan roda dua dan empat",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      color: "text-green-600",
    },
    {
      icon: FaUmbrellaBeach,
      title: "Area Piknik",
      desc: "Tempat santai di ruang terbuka dan menikmati suasana",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      icon: FaChild,
      title: "Playground",
      desc: "Area bermain anak yang aman dan menyenangkan",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      color: "text-orange-500",
    },
    {
      icon: FaDumbbell,
      title: "Gym Outdoor",
      desc: "Peralatan fitness gratis di udara terbuka",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      color: "text-red-500",
    },
    {
      icon: FaWifi,
      title: "WiFi Gratis",
      desc: "Akses internet gratis di seluruh area taman",
      bg: "bg-teal-50",
      iconBg: "bg-teal-100",
      color: "text-teal-600",
    },
  ];

  return (
    <section className="py-24 bg-green-50/40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800">
            Fasilitas Ruang Hijau
          </h2>
          <p className="text-gray-500 mt-3">
            Nikmati berbagai fasilitas lengkap di setiap taman
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`${item.bg} 
                rounded-2xl p-6 
                shadow-sm hover:shadow-md 
                transition`}
              >
                <div
                  className={`w-12 h-12 
                  flex items-center justify-center 
                  rounded-xl 
                  ${item.iconBg} 
                  ${item.color} 
                  text-lg`}
                >
                  <Icon />
                </div>

                <h3 className="mt-4 font-semibold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
