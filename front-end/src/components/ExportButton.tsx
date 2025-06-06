
import { useState } from 'react';
import { Button } from './ui/button';
import { Download, Check } from 'lucide-react';
import { Bookcase } from './Models';

interface ExportButtonProps {
  bookcaseData: Bookcase;
}

const ExportButton = ({ bookcaseData }: ExportButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleExport = async () => {
    try {
      const exportData = {
        bookcase: bookcaseData
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="flex items-center space-x-2"
    >
      {isCopied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Export JSON</span>
        </>
      )}
    </Button>
  );
};

export default ExportButton;
