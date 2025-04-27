
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

interface FinancialMetric {
  value: number;
  isHealthy: boolean;
  rule: string;
}

interface FinancialMetricsTableProps {
  financialHealth: {
    liquidity: FinancialMetric;
    currentRatio: FinancialMetric;
    savingsRatio: FinancialMetric;
    debtRatio: FinancialMetric;
    debtServiceRatio: FinancialMetric;
    solvencyRatio: FinancialMetric;
    investmentRatio: FinancialMetric;
  };
}

const FinancialMetricsTable = ({ financialHealth }: FinancialMetricsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Aspek</TableHead>
          <TableHead>Nilai</TableHead>
          <TableHead>Aturan</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Likuiditas</TableCell>
          <TableCell>{financialHealth.liquidity.value.toFixed(2)}</TableCell>
          <TableCell>{financialHealth.liquidity.rule}</TableCell>
          <TableCell>
            {financialHealth.liquidity.isHealthy ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
              </div>
            )}
          </TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell className="font-medium">Rasio Lancar</TableCell>
          <TableCell>{financialHealth.currentRatio.value.toFixed(2)}</TableCell>
          <TableCell>{financialHealth.currentRatio.rule}</TableCell>
          <TableCell>
            {financialHealth.currentRatio.isHealthy ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
              </div>
            )}
          </TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell className="font-medium">Rasio Tabungan</TableCell>
          <TableCell>{financialHealth.savingsRatio.value.toFixed(2)}%</TableCell>
          <TableCell>{financialHealth.savingsRatio.rule}</TableCell>
          <TableCell>
            {financialHealth.savingsRatio.isHealthy ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
              </div>
            )}
          </TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell className="font-medium">Rasio Utang</TableCell>
          <TableCell>{financialHealth.debtRatio.value.toFixed(2)}%</TableCell>
          <TableCell>{financialHealth.debtRatio.rule}</TableCell>
          <TableCell>
            {financialHealth.debtRatio.isHealthy ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
              </div>
            )}
          </TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell className="font-medium">Pelunasan Utang</TableCell>
          <TableCell>{financialHealth.debtServiceRatio.value.toFixed(2)}%</TableCell>
          <TableCell>{financialHealth.debtServiceRatio.rule}</TableCell>
          <TableCell>
            {financialHealth.debtServiceRatio.isHealthy ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
              </div>
            )}
          </TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell className="font-medium">Solvensi</TableCell>
          <TableCell>{financialHealth.solvencyRatio.value.toFixed(2)}%</TableCell>
          <TableCell>{financialHealth.solvencyRatio.rule}</TableCell>
          <TableCell>
            {financialHealth.solvencyRatio.isHealthy ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
              </div>
            )}
          </TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell className="font-medium">Investasi</TableCell>
          <TableCell>{financialHealth.investmentRatio.value.toFixed(2)}%</TableCell>
          <TableCell>{financialHealth.investmentRatio.rule}</TableCell>
          <TableCell>
            {financialHealth.investmentRatio.isHealthy ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
              </div>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default FinancialMetricsTable;

