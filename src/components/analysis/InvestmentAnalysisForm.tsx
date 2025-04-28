
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getInvestmentRecommendation, RiskPreference, BudgetLevel } from '@/utils/investmentAnalysis';

interface InvestmentAnalysisFormProps {
  onClose: () => void;
}

const InvestmentAnalysisForm = ({ onClose }: InvestmentAnalysisFormProps) => {
  const [riskPreference, setRiskPreference] = useState<RiskPreference>('moderate');
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>('medium');
  const [recommendation, setRecommendation] = useState<ReturnType<typeof getInvestmentRecommendation> | null>(null);

  const handleAnalyze = () => {
    const result = getInvestmentRecommendation(riskPreference, budgetLevel);
    setRecommendation(result);
  };

  return (
    <Card className="p-6 bg-card text-card-foreground">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Analisis Rekomendasi Investasi</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Preferensi Risiko</Label>
              <RadioGroup
                value={riskPreference}
                onValueChange={(value) => setRiskPreference(value as RiskPreference)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative">Konservatif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderat</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="aggressive" id="aggressive" />
                  <Label htmlFor="aggressive">Agresif</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Level Anggaran</Label>
              <RadioGroup
                value={budgetLevel}
                onValueChange={(value) => setBudgetLevel(value as BudgetLevel)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Rendah</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Sedang</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">Tinggi</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="mt-6 space-x-4">
            <Button onClick={handleAnalyze} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Analisis
            </Button>
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>

        {recommendation && (
          <div className="mt-6 space-y-4 border-t pt-4">
            <h4 className="font-semibold">Rekomendasi Investasi:</h4>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Produk:</span> {recommendation.products.join(', ')}</p>
              <p className="text-sm"><span className="font-medium">Deskripsi:</span> {recommendation.description}</p>
              <p className="text-sm"><span className="font-medium">Level Risiko:</span> {recommendation.riskLevel}</p>
              <p className="text-sm"><span className="font-medium">Estimasi Return:</span> {recommendation.expectedReturn}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default InvestmentAnalysisForm;
