import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, BarChart3, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ValuationInsightsProps {
  valuation: {
    estimated_value: number;
    confidence: number;
    value_range: { min: number; max: number; };
    data_source: 'ebay' | 'ai' | 'hybrid';
    ebay_insights?: {
      average_price: number;
      listing_count: number;
      price_range: { min: number; max: number; };
      sample_items?: Array<{
        title: string;
        price: number;
        condition: string;
      }>;
    };
    ai_estimate?: {
      estimated_value: number;
      reasoning: string;
    };
    reasoning: string;
    market_trend?: 'stable' | 'appreciating' | 'depreciating';
  };
}

export const ValuationInsights = ({ valuation }: ValuationInsightsProps) => {
  const isEbayBacked = valuation.data_source === 'ebay' || valuation.data_source === 'hybrid';
  
  const getBadgeVariant = () => {
    if (valuation.data_source === 'ebay') return 'default';
    if (valuation.data_source === 'hybrid') return 'secondary';
    return 'outline';
  };

  const getBadgeText = () => {
    if (valuation.data_source === 'ebay') return '📊 eBay Data';
    if (valuation.data_source === 'hybrid') return '🔄 Hybrid Data';
    return '🤖 AI Estimate';
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Market Valuation</CardTitle>
          <Badge variant={getBadgeVariant()}>
            {getBadgeText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Price Display */}
        <div className="text-center py-6 bg-primary/5 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Estimated Value</p>
          <p className="text-4xl font-bold text-primary">
            ${valuation.estimated_value.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Progress value={valuation.confidence} className="w-32 h-2" />
            <p className="text-sm font-medium text-muted-foreground">
              {valuation.confidence}% confidence
            </p>
          </div>
        </div>
        
        {/* Price Range */}
        <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground mb-1">Low</p>
            <p className="text-lg font-semibold">
              ${valuation.value_range.min.toLocaleString()}
            </p>
          </div>
          <BarChart3 className="h-5 w-5 text-muted-foreground mx-4" />
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground mb-1">High</p>
            <p className="text-lg font-semibold">
              ${valuation.value_range.max.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* eBay Insights */}
        {valuation.ebay_insights && (
          <div className="space-y-3 p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {valuation.ebay_insights.listing_count} current eBay listings
              </span>
            </div>
            
            {valuation.ebay_insights.sample_items && valuation.ebay_insights.sample_items.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-xs font-medium text-muted-foreground">Sample Listings:</p>
                {valuation.ebay_insights.sample_items.map((item, idx) => (
                  <div key={idx} className="text-xs pl-6 py-1 border-l-2 border-primary/20">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-muted-foreground">
                      ${item.price.toLocaleString()} • {item.condition}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              {valuation.reasoning}
            </p>
          </div>
        )}
        
        {/* AI-only notice */}
        {!isEbayBacked && valuation.ai_estimate && (
          <div className="p-4 border rounded-lg bg-secondary/5">
            <p className="text-xs text-muted-foreground italic">
              {valuation.reasoning}
            </p>
          </div>
        )}
        
        {/* Market Trend */}
        {valuation.market_trend && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="capitalize">Market trend: {valuation.market_trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
