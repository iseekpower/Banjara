import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Clock, Mountain, Thermometer, Camera, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const KheergangaTrek = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Helmet>
        <title>Kheerganga Trek Guide 2025: Complete Trekking Experience from Kalga | Banjara Barracks</title>
        <meta name="description" content="Complete guide to Kheerganga Trek from Kalga village. Best time to visit, trek route, hot springs, camping, and tips for beginners. Book your stay at Banjara Barracks, your gateway to Parvati Valley treks." />
        <meta name="keywords" content="Kheerganga trek, Kheerganga hot springs, Parvati Valley trek, Kalga to Kheerganga, best time Kheerganga, Kheerganga camping, Himachal Pradesh trekking, Banjara Barracks Kalga" />
        <link rel="canonical" href="https://mountain-retreats-2.preview.emergentagent.com/blog/kheerganga-trek" />
      </Helmet>

      {/* Hero */}
      <section className="relative h-96 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">Kheerganga Trek</h1>
            <p className="text-xl mb-6">Experience the Magic of Hot Springs in the Himalayas</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 12 km from Barshaini</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 4-6 hours</span>
              <span className="flex items-center gap-2"><Mountain className="w-4 h-4" /> 2,960 meters</span>
            </div>
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
          <h2 className="text-3xl font-bold text-stone-900 mb-6">Complete Guide to Kheerganga Trek from Kalga</h2>
          
          <p className="text-lg text-stone-700 leading-relaxed mb-6">
            The <strong>Kheerganga Trek</strong> is one of the most popular and rewarding treks in <strong>Parvati Valley, Himachal Pradesh</strong>. Known for its stunning natural beauty, dense pine forests, and the famous <strong>hot water springs</strong> at the summit, this trek offers an unforgettable Himalayan experience. Starting from Kalga village where <strong>Banjara Barracks</strong> is located, you have the unique advantage of a less crowded, more scenic route to Kheerganga.
          </p>

          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 my-8">
            <h3 className="text-xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Quick Trek Facts
            </h3>
            <ul className="space-y-2 text-stone-700">
              <li><strong>Distance:</strong> 12-13 km one way from Barshaini, 15 km from Kalga</li>
              <li><strong>Duration:</strong> 4-6 hours ascent, 3-4 hours descent</li>
              <li><strong>Altitude:</strong> 2,960 meters (9,711 feet)</li>
              <li><strong>Difficulty:</strong> Easy to Moderate (suitable for beginners)</li>
              <li><strong>Best Months:</strong> April-June, September-November</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">Why Start from Kalga (Banjara Barracks)?</h2>
          <p className="text-stone-700 leading-relaxed mb-4">
            While most trekkers start from Barshaini, starting your <strong>Kheerganga trek from Kalga village</strong> offers several unique advantages:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-stone-700 mb-6">
            <li><strong>Less Crowded Route:</strong> The Kalga-Kheerganga trail sees significantly fewer trekkers</li>
            <li><strong>More Scenic:</strong> Trek through dense forests and authentic village landscapes</li>
            <li><strong>Better Acclimatization:</strong> Stay at Banjara Barracks (2,300m) before trekking to adjust to altitude</li>
            <li><strong>Authentic Experience:</strong> Walk through traditional Himalayan villages</li>
            <li><strong>Flexible Routes:</strong> Option to go via Bunbuni Pass for experienced trekkers</li>
          </ul>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">Best Time to Visit Kheerganga</h2>
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-xl font-bold text-emerald-600 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Summer (April - June)
              </h3>
              <p className="text-stone-700 mb-2"><strong>Weather:</strong> Pleasant, 15-25°C during day</p>
              <p className="text-stone-700 mb-2"><strong>Trail Condition:</strong> Clear and well-marked</p>
              <p className="text-stone-700 mb-2"><strong>Highlights:</strong> Blooming wildflowers, lush greenery</p>
              <p className="text-stone-700"><strong>Crowding:</strong> Moderate to High</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-xl font-bold text-emerald-600 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Autumn (September - November)
              </h3>
              <p className="text-stone-700 mb-2"><strong>Weather:</strong> Cool and crisp, 10-20°C</p>
              <p className="text-stone-700 mb-2"><strong>Trail Condition:</strong> Excellent visibility</p>
              <p className="text-stone-700 mb-2"><strong>Highlights:</strong> Clear mountain views, golden foliage</p>
              <p className="text-stone-700"><strong>Crowding:</strong> Moderate</p>
            </div>
          </div>
          <p className="text-stone-700 leading-relaxed mb-4">
            <strong>Avoid:</strong> July-August (monsoon season) due to slippery trails and landslide risks. December-February brings heavy snow, making the trek extremely challenging and suitable only for experienced mountaineers.
          </p>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">Trek Route Options from Kalga</h2>
          
          <h3 className="text-2xl font-bold text-stone-800 mt-8 mb-4">Route 1: Kalga → Barshaini → Kheerganga (Recommended for Beginners)</h3>
          <p className="text-stone-700 leading-relaxed mb-4">
            This is the most popular and easiest route:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-stone-700 mb-6">
            <li>Start from Banjara Barracks, walk 40 minutes downhill to Barshaini</li>
            <li>Begin trek from Barshaini parking area</li>
            <li>Pass through Nakthan village (small cafes available)</li>
            <li>Cross wooden bridges over Parvati River</li>
            <li>Trek through Rudranag (waterfall viewpoint)</li>
            <li>Final ascent through pine forest to Kheerganga</li>
            <li><strong>Total Distance:</strong> 12-13 km, <strong>Time:</strong> 5-6 hours</li>
          </ul>

          <h3 className="text-2xl font-bold text-stone-800 mt-8 mb-4">Route 2: Kalga → Bunbuni Pass → Kheerganga (For Experienced Trekkers)</h3>
          <p className="text-stone-700 leading-relaxed mb-4">
            A more challenging but incredibly scenic route:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-stone-700 mb-6">
            <li>Direct trail from Kalga through dense forest</li>
            <li>Steeper ascent but less crowded</li>
            <li>Pass through Bunbuni Pass meadows</li>
            <li>Stunning 360-degree mountain views</li>
            <li><strong>Total Distance:</strong> 10-11 km, <strong>Time:</strong> 5-7 hours</li>
            <li><strong>Difficulty:</strong> Moderate to Challenging</li>
          </ul>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">What to Expect at Kheerganga</h2>
          <p className="text-stone-700 leading-relaxed mb-4">
            Reaching Kheerganga feels like discovering a hidden paradise in the mountains:
          </p>
          
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-xl my-8">
            <h3 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <Thermometer className="w-6 h-6" />
              The Famous Hot Springs
            </h3>
            <p className="text-stone-700 leading-relaxed mb-4">
              The highlight of Kheerganga is undoubtedly the <strong>natural hot water springs</strong>. After a long trek, soaking in these sulfurous hot pools (around 40°C) is incredibly rejuvenating. The springs are believed to have medicinal properties and are considered sacred by locals.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-stone-700">
              <li>Separate pools for men and women</li>
              <li>Best time to visit: Early morning or sunset</li>
              <li>Bring a towel and change of clothes</li>
              <li>Temperature: Naturally warm year-round</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-stone-800 mt-8 mb-4">Camping at Kheerganga</h3>
          <p className="text-stone-700 leading-relaxed mb-4">
            While camping was once allowed, regulations change frequently. Currently, overnight stays are limited:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-stone-700 mb-6">
            <li>Some basic campsites operate (check current status before trekking)</li>
            <li>Small cafes serve Maggi, chai, and simple meals</li>
            <li>Most trekkers now do it as a day trek</li>
            <li>Consider staying at Banjara Barracks before and after</li>
          </ul>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">What to Carry for Kheerganga Trek</h2>
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 mb-3">Essentials</h3>
              <ul className="space-y-2 text-stone-700 text-sm">
                <li>✓ Comfortable trekking shoes</li>
                <li>✓ Backpack (20-30L)</li>
                <li>✓ Water bottle (2L minimum)</li>
                <li>✓ Energy snacks (nuts, chocolate, energy bars)</li>
                <li>✓ Sunscreen and sunglasses</li>
                <li>✓ Basic first-aid kit</li>
                <li>✓ Towel for hot springs</li>
                <li>✓ Extra pair of clothes</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 mb-3">Optional but Recommended</h3>
              <ul className="space-y-2 text-stone-700 text-sm">
                <li>✓ Trekking pole</li>
                <li>✓ Raincoat/poncho</li>
                <li>✓ Headlamp/torch</li>
                <li>✓ Power bank</li>
                <li>✓ Camera (for stunning views)</li>
                <li>✓ Garbage bag (carry back waste)</li>
                <li>✓ Light jacket (even in summer)</li>
                <li>✓ Personal toiletries</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">Tips for First-Time Trekkers</h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8">
            <ul className="space-y-3 text-stone-700">
              <li><strong>1. Start Early:</strong> Begin by 7-8 AM to avoid afternoon heat and have enough daylight</li>
              <li><strong>2. Stay Hydrated:</strong> Drink water regularly, but don't overdrink at once</li>
              <li><strong>3. Pace Yourself:</strong> It's not a race. Take breaks, enjoy the scenery</li>
              <li><strong>4. Respect Nature:</strong> Carry back all waste, don't litter</li>
              <li><strong>5. Follow Trail Markers:</strong> Stay on marked paths, especially the Kalga route</li>
              <li><strong>6. Check Weather:</strong> Always check forecast before starting</li>
              <li><strong>7. Inform Someone:</strong> Let someone know your trekking plans</li>
              <li><strong>8. Acclimatize:</strong> Spend a night at Banjara Barracks (2,300m) before trekking</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">Photography Tips</h2>
          <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md my-8">
            <Camera className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-stone-700 leading-relaxed mb-4">
                Kheerganga trek offers incredible photo opportunities:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-stone-700">
                <li><strong>Golden Hour Magic:</strong> Early morning light on mountain peaks is spectacular</li>
                <li><strong>Waterfall Shots:</strong> Rudranag waterfall is perfect for long exposure photography</li>
                <li><strong>Forest Trails:</strong> Dappled sunlight through pine trees creates magical scenes</li>
                <li><strong>Hot Springs:</strong> Respectful photography allowed (ask permission from bathers)</li>
                <li><strong>Valley Views:</strong> Multiple viewpoints offer 180-degree panoramas</li>
                <li><strong>Night Sky:</strong> If camping, the star-filled Himalayan sky is breathtaking</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">Why Choose Banjara Barracks as Your Base?</h2>
          <p className="text-stone-700 leading-relaxed mb-4">
            <strong>Banjara Barracks in Kalga</strong> is the perfect base for your Kheerganga trek adventure:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-stone-700 mb-6">
            <li><strong>Strategic Location:</strong> Right at the start of Kalga, perfect starting point for multiple trek routes</li>
            <li><strong>Acclimatization:</strong> At 2,300m, helps your body adjust before the trek</li>
            <li><strong>Comfortable Stay:</strong> Rest well before and after your trek in cozy rooms</li>
            <li><strong>Local Knowledge:</strong> Sadhya and Sankalp can guide you on best routes and current conditions</li>
            <li><strong>Delicious Meals:</strong> Fuel up with hearty breakfast before trekking, relax with dinner after</li>
            <li><strong>Trek Arrangements:</strong> Help with trek planning, route selection, and local guides if needed</li>
            <li><strong>Less Crowded:</strong> Escape the Barshaini rush, start fresh from a peaceful village</li>
          </ul>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">Nearby Attractions to Combine</h2>
          <p className="text-stone-700 leading-relaxed mb-4">
            Make the most of your Parvati Valley visit by exploring these nearby destinations:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-stone-700 mb-8">
            <li><strong>Bunbuni Pass:</strong> Day trek from Kalga with stunning views (5-6 hours)</li>
            <li><strong>Pulga Village:</strong> Beautiful village with waterfalls, 30 minutes from Kalga</li>
            <li><strong>Tosh Village:</strong> Popular café village, 1.5 hours from Kalga</li>
            <li><strong>Fairy Forest:</strong> Mystical forest with caves, perfect for camping</li>
            <li><strong>Manikaran Sahib:</strong> Sacred Gurudwara with hot springs, day trip option</li>
          </ul>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-2xl my-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Trek Kheerganga?</h3>
            <p className="text-lg mb-6 opacity-90">
              Book your stay at Banjara Barracks and start your Himalayan adventure from Kalga
            </p>
            <a href="https://www.airbnb.co.in/rooms/51261620" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-stone-100 text-lg px-8 py-6">
                Book on Airbnb
              </Button>
            </a>
          </div>

          <h2 className="text-3xl font-bold text-stone-900 mt-12 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-6 py-2">
              <h4 className="font-bold text-lg text-stone-900 mb-2">Is Kheerganga trek difficult for beginners?</h4>
              <p className="text-stone-700">No, Kheerganga is considered easy to moderate and is perfect for first-time trekkers. The trail is well-marked, and the gradient is manageable. Start from Kalga for a less crowded experience.</p>
            </div>
            
            <div className="border-l-4 border-emerald-500 pl-6 py-2">
              <h4 className="font-bold text-lg text-stone-900 mb-2">Can I do Kheerganga trek in one day?</h4>
              <p className="text-stone-700">Yes, most trekkers now complete it as a day trek. Start early from Banjara Barracks (6-7 AM), reach Kheerganga by noon, enjoy hot springs, and return by evening.</p>
            </div>
            
            <div className="border-l-4 border-emerald-500 pl-6 py-2">
              <h4 className="font-bold text-lg text-stone-900 mb-2">What is the temperature at Kheerganga?</h4>
              <p className="text-stone-700">Summer: 15-25°C during day, 5-10°C at night. Winter: Below 0°C with heavy snow. Always carry a light jacket even in summer.</p>
            </div>
            
            <div className="border-l-4 border-emerald-500 pl-6 py-2">
              <h4 className="font-bold text-lg text-stone-900 mb-2">Is camping allowed at Kheerganga?</h4>
              <p className="text-stone-700">Regulations change frequently. Currently, overnight camping is restricted. Check latest status with Banjara Barracks or local authorities before trekking.</p>
            </div>
            
            <div className="border-l-4 border-emerald-500 pl-6 py-2">
              <h4 className="font-bold text-lg text-stone-900 mb-2">How do I reach Kalga from Delhi/Manali?</h4>
              <p className="text-stone-700">From Delhi: Bus to Bhuntar (12-14 hours) → Taxi to Kasol → Local taxi to Kalga. From Manali: Bus to Kasol (3-4 hours) → Taxi to Kalga (45 minutes).</p>
            </div>
          </div>

          <div className="bg-stone-100 p-8 rounded-xl mt-12">
            <h3 className="text-2xl font-bold text-stone-900 mb-4">Plan Your Kheerganga Trek with Banjara Barracks</h3>
            <p className="text-stone-700 leading-relaxed mb-6">
              At <strong>Banjara Barracks</strong>, we don't just provide accommodation—we help you experience the true magic of Parvati Valley. Our founders, Sadhya and Sankalp Sharma, are passionate about these mountains and can offer invaluable local insights for your Kheerganga adventure.
            </p>
            <p className="text-stone-700 leading-relaxed mb-6">
              Whether you're a first-time trekker or an experienced mountaineer, starting your Kheerganga trek from Kalga offers a more authentic, less crowded, and equally beautiful alternative to the standard Barshaini route.
            </p>
            <p className="text-stone-700 leading-relaxed">
              <strong>Book your stay today</strong> and let Banjara Barracks be your gateway to one of the most memorable treks in the Himalayas.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default KheergangaTrek;