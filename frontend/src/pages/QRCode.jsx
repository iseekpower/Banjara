import { QRCodeSVG } from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const QRCodePage = () => {
  const websiteURL = 'https://mountain-retreats-2.preview.emergentagent.com/';

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'banjara-barracks-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success('QR Code downloaded successfully!');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Banjara Barracks - QR Code',
          text: 'Scan to visit Banjara Barracks website',
          url: websiteURL
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      navigator.clipboard.writeText(websiteURL);
      toast.success('URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-0 shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-xl">
          <CardTitle className="text-3xl font-bold mb-2">
            Banjara Barracks
          </CardTitle>
          <p className="text-emerald-50">Scan to visit our website</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* QR Code */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-emerald-100">
              <QRCodeSVG
                id="qr-code-svg"
                value={websiteURL}
                size={300}
                level="H"
                includeMargin={true}
                fgColor="#059669"
              />
            </div>

            {/* URL Display */}
            <div className="text-center">
              <p className="text-sm text-stone-600 mb-1">Website URL</p>
              <p className="text-lg font-mono bg-stone-100 px-4 py-2 rounded-lg text-emerald-700 break-all">
                {websiteURL}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6"
              >
                <Download className="w-5 h-5 mr-2" />
                Download QR Code
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-lg py-6"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>

            {/* Info */}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 w-full">
              <p className="text-sm text-stone-700 text-center">
                <strong>How to use:</strong> Print this QR code or save it to display at your homestay. 
                Guests can scan it with their phone camera to instantly visit your website.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodePage;
