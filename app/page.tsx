import Calculator from '@/components/Calculator';
import HistoryList from '@/components/HistoryList';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {process.env.NEXT_PUBLIC_APP_NAME} - Food & Drink Calculator
        </h1>
        <p className="text-gray-600">
          Calculate recipe scaling, unit conversions, nutrition, and more!
        </p>
      </div>
      <Calculator />
      <HistoryList />
    </div>
  );
}