import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Clock, Mountain, ExternalLink } from 'lucide-react';

const AIRBNB_URL = 'https://www.airbnb.co.in/rooms/51261620?source_impression_id=p3_1762452247_P3PmxG8ksmAwf3Rz';

const blogData = {
  'kheerganga-trek': {
    title: 'Kheerganga Trek: Complete Guide from Kalga',
    subtitle: 'Experience the Magic of Hot Springs in the Himalayas',
    metaTitle: 'Kheerganga Trek Guide 2025 | Best Route from Kalga | Banjara Barracks',
    metaDescription: 'Complete Kheerganga Trek guide from Kalga village. Hot springs, best time to visit, trek routes, camping info. Start from Banjara Barracks for less crowded trails.',
    keywords: 'Kheerganga trek, hot springs Parvati Valley, Kalga to Kheerganga, trek guide Himachal',
    distance: '12 km from Barshaini',
    duration: '4-6 hours',
    altitude: '2,960 meters',
    content: `Kheerganga Trek is one of the most popular Himalayan treks in Parvati Valley. Famous for its natural hot water springs at the summit, this trek offers stunning views, dense pine forests, and an unforgettable mountain experience.

Starting from Kalga (where Banjara Barracks is located) gives you a less crowded, more scenic route compared to the standard Barshaini trail. You can either walk down to Barshaini first, or take the adventurous Kalga-Bunbuni Pass-Kheerganga route.

Best Time: April-June and September-November. Avoid monsoon (July-August) due to slippery trails.

What to Expect: The trek takes you through beautiful pine forests, over wooden bridges crossing mountain streams, past the Rudranag waterfall, and finally to the meadows of Kheerganga where the hot springs await. The sulfurous hot water pools (around 40°C) are incredibly rejuvenating after the long trek.

Pro Tip: Start your trek early from Banjara Barracks (6-7 AM) to avoid afternoon heat and have plenty of daylight. Stay a night at our homestay before trekking to acclimatize to the altitude.`
  },
  'tosh-village': {
    title: 'Tosh Village: Hidden Gem of Parvati Valley',
    subtitle: 'Cafés, Waterfalls, and Mountain Views',
    metaTitle: 'Tosh Village Travel Guide 2025 | Things to Do | Stay at Kalga',
    metaDescription: 'Discover Tosh village in Parvati Valley. Best cafés, trekking trails, waterfalls, and hippie culture. Plan your trip from Banjara Barracks in nearby Kalga.',
    keywords: 'Tosh village, Parvati Valley cafes, Tosh waterfall, hippie village Himachal',
    distance: '8 km from Kalga',
    duration: '2 hours walk',
    altitude: '2,400 meters',
    content: `Tosh is a picturesque village perched high in the Parvati Valley, known for its vibrant café culture, stunning mountain views, and laid-back atmosphere. Located just 8 km from Kalga (where Banjara Barracks is located), Tosh makes for a perfect day trip or overnight excursion.

Top Attractions:
- Tosh Waterfall: A short 1-2 km hike leads to this beautiful cascade
- Pink Floyd Café & Boom Shiva Café: Enjoy great food with epic valley views
- Trek to Kheerganga: Alternative starting point
- Mountain Photography: Panoramic views of snow-capped peaks
- Shopping: Local handicrafts, woolens, and souvenirs

Food Scene: Tosh has evolved into a food lover's paradise with Israeli, Tibetan, and continental cuisines. Try the famous Nutella pancakes, thukpa, momos, and fresh mountain trout.

How to Reach from Banjara Barracks: Take a taxi from Kalga to Barshaini, then another to Tosh. Or enjoy a scenic 2-hour walk through the valley.

Best Time: April-June for pleasant weather, September-November for clear skies and autumn colors.`
  },
  'pulga-village': {
    title: 'Pulga Village: Serenity in Apple Orchards',
    subtitle: 'A Peaceful Alternative to Crowded Spots',
    metaTitle: 'Pulga Village Guide | Things to Do | Stay at Kalga Banjara Barracks',
    metaDescription: 'Explore Pulga village near Kalga. Apple orchards, waterfalls, peaceful trails. Perfect day trip from Banjara Barracks homestay.',
    keywords: 'Pulga village, apple orchards Himachal, Pulga waterfall, offbeat Parvati Valley',
    distance: '3 km from Kalga',
    duration: '1 hour walk',
    altitude: '2,200 meters',
    content: `Pulga is a serene village located just 3 km from Kalga, offering a quieter, more authentic Himalayan experience. Surrounded by apple orchards and pine forests, Pulga is perfect for travelers seeking tranquility away from the more touristy spots.

What to Do:
- Walk through apple orchards (especially beautiful in spring bloom)
- Visit the hidden waterfall near the village
- Interact with locals and learn about traditional mountain life
- Enjoy homemade local Himachali food
- Trek to nearby fairy forest
- Photography enthusiasts will love the rustic village setting

Why Visit: Pulga retains its authentic charm with fewer tourists. The village offers stunning views of the valley and is an excellent base for short nature walks.

From Banjara Barracks: It's an easy 1-hour walk from Kalga to Pulga through scenic trails. You can also combine visits to both Pulga and Tulga villages in a single day.

Accommodation: While Pulga has basic guesthouses, staying at Banjara Barracks in Kalga gives you better facilities while still being close enough for easy day trips.`
  },
  'fairy-forest': {
    title: 'Fairy Forest Kalga: Mystical Forest with Hidden Caves',
    subtitle: 'Perfect for Camping Under the Stars',
    metaTitle: 'Fairy Forest Kalga Guide | Secret Caves | Camping Near Banjara Barracks',
    metaDescription: 'Discover Fairy Forest near Kalga village. Hidden caves, camping spots, mystical atmosphere. 2km from Banjara Barracks homestay.',
    keywords: 'Fairy Forest Kalga, hidden caves Parvati Valley, camping Kalga, secret spots Himachal',
    distance: '2 km from Kalga',
    duration: '45 minutes',
    altitude: '2,400 meters',
    content: `Fairy Forest is a mystical woodland area located just 2 km from Kalga village, known for its hidden rock caves, enchanting atmosphere, and excellent camping spots. This lesser-known gem offers a magical experience for adventure seekers.

Highlights:
- Secret Caves: Natural rock formations create caves perfect for exploration
- Camping Paradise: Flat meadows ideal for pitching tents
- Stargazing: Minimal light pollution offers spectacular night sky views
- Peaceful Trails: Walk through dense forests with dappled sunlight
- Photography: Mystical forest scenes and dramatic rock formations

Camping Information: The forest has several clearings suitable for camping. Best experienced with proper camping gear. Banjara Barracks can help arrange camping equipment and guide services.

How to Reach: A 45-minute easy walk from Banjara Barracks. The trail is well-marked and suitable for beginners.

Best Time: April-June for comfortable weather, September-October for clear night skies. Avoid monsoon season when trails become slippery.

Local Tip: Start your hike in the afternoon, set up camp, enjoy sunset, stargaze at night, and return to Banjara Barracks the next morning for a hearty breakfast!`
  },
  'manikaran': {
    title: 'Manikaran Sahib: Sacred Hot Springs & Gurudwara',
    subtitle: 'A Spiritual Experience in the Valley',
    metaTitle: 'Manikaran Sahib Guide | Hot Springs | Day Trip from Kalga',
    metaDescription: 'Visit Manikaran Sahib Gurudwara and hot springs. Complete guide for day trip from Banjara Barracks Kalga. Sacred site in Parvati Valley.',
    keywords: 'Manikaran Sahib, Parvati Valley Gurudwara, hot springs Himachal, spiritual tourism',
    distance: '18 km from Kalga',
    duration: 'Day trip',
    altitude: '1,760 meters',
    content: `Manikaran is a sacred pilgrimage site located in Parvati Valley, famous for its hot water springs and the beautiful Gurudwara Manikaran Sahib. It's an important site for both Sikhs and Hindus, with ancient temples and religious significance.

What to Experience:
- Gurudwara Manikaran Sahib: Beautiful Sikh shrine with community kitchen (langar)
- Natural Hot Springs: Water so hot it's used to cook food
- Lord Shiva Temple: Ancient temple with religious importance
- Ram Temple: Another significant Hindu shrine
- Parvati River: Flowing right beside the town
- Local Market: Shop for Kullu shawls and handicrafts

The Experience: The hot springs are naturally heated by geothermal activity. You can take a hot bath in designated areas. The Gurudwara serves free langar (community meal) to all visitors - a humbling spiritual experience.

How to Reach from Banjara Barracks: Take a taxi from Kalga to Manikaran (45 minutes). Or take local bus from Kasol to Manikaran.

Duration: Plan for a full day trip. Morning departure from Kalga, return by evening.

Dress Code: Modest clothing required. Head covering mandatory inside Gurudwara (provided at entrance).`
  },
  'kasol': {
    title: 'Kasol: The Amsterdam of India',
    subtitle: 'Hub of Parvati Valley Adventures',
    metaTitle: 'Kasol Travel Guide 2025 | Things to Do | Base from Kalga',
    metaDescription: 'Complete Kasol guide. Cafes, shopping, food, activities. Perfect day trip from Banjara Barracks in Kalga village.',
    keywords: 'Kasol travel guide, Parvati Valley hub, Kasol cafes, Israeli village India',
    distance: '16 km from Kalga',
    duration: 'Day trip',
    altitude: '1,580 meters',
    content: `Kasol is the bustling hub of Parvati Valley, known for its vibrant café culture, Israeli influence, and as a base for many Himalayan treks. While staying at the quieter Banjara Barracks in Kalga, Kasol makes for an exciting day trip.

Top Things to Do:
- Café Hopping: Moon Dance Café, Evergreen Café, German Bakery
- Riverside Walks: Stroll along the beautiful Parvati River
- Shopping: Tibetan jewelry, hippie clothes, local handicrafts
- Food Scene: Israeli, Italian, and Indian cuisines
- Chalal Village: Short trek across the bridge
- Music & Culture: Live music at various cafés
- Nightlife: Kasol has the most active nightlife in the valley

Why Visit: Kasol offers modern amenities, ATMs, medical facilities, and a wide variety of food options. It's more developed than surrounding villages, making it useful for supplies and entertainment.

How to Reach from Banjara Barracks: 40-minute taxi ride from Kalga. Frequent shared taxis available from Barshaini.

Local Tip: Visit Kasol for shopping, dining, and supplies, but return to the peaceful Banjara Barracks in Kalga for a good night's sleep away from the noise.

Best Time: Year-round destination, but peak season is May-June and September-October.`
  },
  'bunbuni-pass': {
    title: 'Bunbuni Pass Trek: Scenic Ridge Walk from Kalga',
    subtitle: '360-Degree Himalayan Views',
    metaTitle: 'Bunbuni Pass Trek Guide | Kalga to Bunbuni | Banjara Barracks',
    metaDescription: 'Bunbuni Pass trek from Kalga. Moderate difficulty, stunning views, 5-6 hours. Complete guide from Banjara Barracks.',
    keywords: 'Bunbuni Pass trek, Kalga trekking, moderate trek Himachal, Parvati Valley hikes',
    distance: '10 km from Kalga',
    duration: '5-6 hours',
    altitude: '3,000 meters',
    content: `Bunbuni Pass is a scenic trek starting right from Kalga village, offering spectacular 360-degree views of the Parvati Valley and surrounding Himalayan peaks. This moderate trek is perfect for those wanting a good workout with rewarding vistas.

Trek Highlights:
- Start from Banjara Barracks doorstep
- Pass through dense rhododendron and pine forests
- Reach meadows with panoramic mountain views
- See Parvati Valley from a bird's eye perspective
- Spot local Himalayan birds and flora
- Can be combined with Kheerganga trek for experienced trekkers

Difficulty Level: Moderate. Requires decent fitness but suitable for regular trekkers. Steeper than Kheerganga but less crowded.

Best Season: May-June for blooming rhododendrons, September-October for clear skies. Avoid during monsoon and heavy winter snow.

What to Carry: Comfortable trekking shoes, water (2L), energy snacks, light jacket, sun protection, camera.

From Banjara Barracks: The trek literally starts from Kalga village. Sadhya and Sankalp can guide you on the best route and current trail conditions.

Local Insight: This trek is less commercialized than Kheerganga, offering a more authentic Himalayan trekking experience. Perfect for photographers and nature lovers.`
  },
  'sar-pass': {
    title: 'Sar Pass Trek: High Altitude Challenge',
    subtitle: 'Multi-Day Adventure Through Snow',
    metaTitle: 'Sar Pass Trek Complete Guide | Starting from Kasol Region',
    metaDescription: 'Sar Pass trek guide. Multi-day high altitude trek, difficulty level, best time. Plan from Banjara Barracks Kalga base.',
    keywords: 'Sar Pass trek, high altitude trek Himachal, multi-day trek, snow trek Parvati Valley',
    distance: ''15 km base from Kalga',
    duration: 'Multi-day (4-5 days)',
    altitude: '4,200 meters',
    content: `Sar Pass is a challenging high-altitude trek that takes you to 4,200 meters through snow-covered landscapes, pine forests, and alpine meadows. This multi-day adventure is for experienced trekkers seeking a thrilling Himalayan challenge.

Trek Overview:
- Duration: 4-5 days
- Maximum Altitude: 4,200 meters (13,780 feet)
- Difficulty: Challenging
- Best Time: May-June (snow trek), September-October (post-monsoon)
- Route: Kasol → Grahan → Mung Thach → Nagaru → Biskeri Ridge → Sar Pass → Barshaini

Highlights:
- Snow trekking experience
- Camping at high-altitude campsites
- Stunning alpine meadows
- 360-degree Himalayan panoramas
- Challenging ascents and descents
- Remote mountain villages

Preparation Required:
- Good physical fitness mandatory
- Prior trekking experience recommended
- Proper trekking gear essential
- Acclimatization important

Planning from Banjara Barracks: Use Kalga as your base for preparation. Spend 2-3 days acclimatizing at Banjara Barracks (2,300m) before starting the trek. Sadhya and Sankalp can help arrange experienced guides, permits, and equipment.

Post-Trek: Return to Banjara Barracks for a well-deserved rest, hot meal, and comfortable bed after your challenging adventure!`
  }
};

const BlogPlace = () => {
  const { place } = useParams();
  const blog = blogData[place];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [place]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Place Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative h-96 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">{blog.title}</h1>
            <p className="text-xl mb-6">{blog.subtitle}</p>
            {blog.distance && (
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {blog.distance}</span>
                {blog.duration && <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {blog.duration}</span>}
                {blog.altitude && <span className="flex items-center gap-2"><Mountain className="w-4 h-4" /> {blog.altitude}</span>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="prose prose-lg max-w-none">
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-stone-700 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-2xl my-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Explore {blog.title.split(':')[0]}?</h3>
          <p className="text-lg mb-6 opacity-90">
            Book your stay at Banjara Barracks in Kalga - Your perfect base for Parvati Valley adventures
          </p>
          <a href={AIRBNB_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-stone-100 text-lg px-8 py-6">
              Book on Airbnb
              <ExternalLink className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>

        <div className="bg-stone-100 p-8 rounded-xl">
          <h3 className="text-2xl font-bold text-stone-900 mb-4">Why Choose Banjara Barracks?</h3>
          <ul className="space-y-3 text-stone-700">
            <li className="flex items-start">
              <span className="text-emerald-600 mr-3">✓</span>
              <span><strong>Perfect Location:</strong> Kalga village is centrally located for all Parvati Valley attractions</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-3">✓</span>
              <span><strong>Local Expertise:</strong> Sadhya & Sankalp know every trail and hidden spot</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-3">✓</span>
              <span><strong>Comfortable Stay:</strong> Rest well in cozy rooms with valley views</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-3">✓</span>
              <span><strong>Delicious Food:</strong> Home-cooked meals with local and continental options</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-3">✓</span>
              <span><strong>Trek Support:</strong> Help with route planning, guides, and equipment</span>
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
};

export default BlogPlace;
