import Image from "next/image";

export default function TentangPage() {
  return (
    <section className="w-full bg-gradient-to-b from-[#E8F7EF] via-[#F5FCF9] to-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-28">

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tentang Ruang Hijau Jakarta
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Komitmen kami untuk menciptakan Jakarta Pusat yang lebih hijau, sehat, dan berkelanjutan
            melalui pengembangan ruang terbuka hijau berkualitas
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Image */}
          <div>
            <Image
              src="/icon/tentangtaman.svg"
              alt="Ilustrasi Ruang Hijau Jakarta"
              width={600}
              height={400}
              priority
              className="rounded-2xl shadow-md"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Visi Kami</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Menjadikan Jakarta Pusat sebagai kawasan metropolitan yang hijau dan berkelanjutan
              dengan menyediakan ruang terbuka hijau yang berkualitas, mudah diakses,
              dan bermanfaat bagi seluruh masyarakat.
            </p>

            {/* List */}
            <ul className="space-y-6">

              {/* Item 1 */}
              <li className="flex items-start gap-4">
                <Image
                  src="/icon/daun.svg"
                  alt="Ikon Lingkungan Berkelanjutan"
                  width={32}
                  height={32}
                  className="mt-1"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Lingkungan Berkelanjutan</h3>
                  <p className="text-gray-700">
                    Menciptakan ekosistem yang seimbang dan berkelanjutan di tengah kota.
                  </p>
                </div>
              </li>

              {/* Item 2 */}
              <li className="flex items-start gap-4">
                <Image
                  src="/icon/komunitas.svg"
                  alt="Ikon Komunitas Aktif"
                  width={32}
                  height={32}
                  className="mt-1"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Komunitas Aktif</h3>
                  <p className="text-gray-700">
                    Membangun komunitas yang peduli lingkungan dan aktif berpartisipasi.
                  </p>
                </div>
              </li>

              {/* Item 3 */}
              <li className="flex items-start gap-4">
                <Image
                  src="/icon/heart.svg"
                  alt="Ikon Kesehatan Masyarakat"
                  width={32}
                  height={32}
                  className="mt-1"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Kesehatan Masyarakat</h3>
                  <p className="text-gray-700">
                    Meningkatkan kualitas hidup dan kesehatan masyarakat perkotaan.
                  </p>
                </div>
              </li>

            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
