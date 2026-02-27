import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { saveCalculation } from '@/lib/db';
import { scaleRecipe, convertUnit, calculateNutrition } from '@/lib/utils';
import { Calculator as CalculatorIcon, ChefHat, Scale, Apple } from 'lucide-react';

type CalculatorMode = 'basic' | 'recipe' | 'unit' | 'nutrition';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [recipeIngredient, setRecipeIngredient] = useState('Flour');
  const [recipeQuantity, setRecipeQuantity] = useState(1);
  const [recipeMultiplier, setRecipeMultiplier] = useState(2);
  const [unitValue, setUnitValue] = useState(1);
  const [unitFrom, setUnitFrom] = useState('cups');
  const [unitTo, setUnitTo] = useState('grams');
  const [caloriesPerServing, setCaloriesPerServing] = useState(100);
  const [servings, setServings] = useState(1);

  const handleButtonClick = (value: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleCalculate = async () => {
    try {
      const result = eval(display);
      setDisplay(result.toString());
      await saveCalculation(display, result.toString(), mode);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleRecipeScale = async () => {
    const result = scaleRecipe(recipeIngredient, recipeQuantity, recipeMultiplier);
    setDisplay(result);
    await saveCalculation(`Scale ${recipeQuantity} ${recipeIngredient} by ${recipeMultiplier}`, result, mode);
  };

  const handleUnitConvert = async () => {
    const result = convertUnit(unitValue, unitFrom, unitTo);
    setDisplay(`${result.toFixed(2)} ${unitTo}`);
    await saveCalculation(`Convert ${unitValue} ${unitFrom} to ${unitTo}`, result.toString(), mode);
  };

  const handleNutritionCalc = async () => {
    const result = calculateNutrition(caloriesPerServing, servings);
    setDisplay(`${result} calories`);
    await saveCalculation(`Nutrition: ${caloriesPerServing} cal/serving * ${servings} servings`, result.toString(), mode);
  };

  useEffect(() => {
    if (mode !== 'basic') {
      setDisplay('0');
    }
  }, [mode]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalculatorIcon className="h-6 w-6" />
          {process.env.NEXT_PUBLIC_APP_NAME} - Food & Drink Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(v) => setMode(v as CalculatorMode)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="recipe">Recipe Scale</TabsTrigger>
            <TabsTrigger value="unit">Unit Converter</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Calc</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <div className="mb-4 p-4 bg-muted rounded-md text-right text-2xl font-mono min-h-[60px] flex items-center justify-end">
              {display}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
                <Button
                  key={btn}
                  variant={btn === '=' ? 'default' : 'outline'}
                  onClick={() => (btn === '=' ? handleCalculate() : handleButtonClick(btn))}
                  className="h-12 text-lg"
                >
                  {btn}
                </Button>
              ))}
              <Button variant="destructive" onClick={handleClear} className="col-span-4 h-12">
                Clear
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="recipe">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                <span className="font-semibold">Recipe Scaling</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ingredient">Ingredient</Label>
                  <Input
                    id="ingredient"
                    value={recipeIngredient}
                    onChange={(e) => setRecipeIngredient(e.target.value)}
                    placeholder="e.g., Flour"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={recipeQuantity}
                    onChange={(e) => setRecipeQuantity(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="multiplier">Multiplier</Label>
                  <Input
                    id="multiplier"
                    type="number"
                    value={recipeMultiplier}
                    onChange={(e) => setRecipeMultiplier(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleRecipeScale} className="w-full">
                    Scale Recipe
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-md text-center text-lg font-mono">
                {display}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="unit">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                <span className="font-semibold">Unit Converter</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="unitValue">Value</Label>
                  <Input
                    id="unitValue"
                    type="number"
                    value={unitValue}
                    onChange={(e) => setUnitValue(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="unitFrom">From Unit</Label>
                  <Select value={unitFrom} onValueChange={setUnitFrom}>
                    <SelectTrigger id="unitFrom">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {['cups', 'grams', 'milliliters', 'ounces'].map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="unitTo">To Unit</Label>
                  <Select value={unitTo} onValueChange={setUnitTo}>
                    <SelectTrigger id="unitTo">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {['cups', 'grams', 'milliliters', 'ounces'].map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleUnitConvert} className="w-full">
                Convert
              </Button>
              <div className="p-4 bg-muted rounded-md text-center text-lg font-mono">
                {display}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="nutrition">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5" />
                <span className="font-semibold">Nutrition Calculator</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories per Serving</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={caloriesPerServing}
                    onChange={(e) => setCaloriesPerServing(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Number of Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={handleNutritionCalc} className="w-full">
                Calculate Total Calories
              </Button>
              <div className="p-4 bg-muted rounded-md text-center text-lg font-mono">
                {display}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}