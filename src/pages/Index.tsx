import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Home, Shield, Camera, FileText, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();

  // Redirect authenticated users to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3">
                <Home className="h-12 w-12 text-primary" />
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block">CTRL Tech</span>
              <span className="block text-primary mt-2">Asset Inventory</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              AI-powered asset scanning and inventory management for homeowners. 
              Quickly capture your belongings, get estimated values, and generate 
              claim-ready reports for insurance.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/auth">
                  <Camera className="mr-2 h-5 w-5" />
                  Start Scanning
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/auth">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything You Need for Asset Management
            </h2>
            <p className="mt-4 text-muted-foreground">
              Streamline your home inventory with our comprehensive suite of tools
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Camera className="h-10 w-10 text-primary mb-4" />
                <CardTitle>AI-Powered Scanning</CardTitle>
                <CardDescription>
                  Simply take a photo and our AI extracts item details, 
                  estimates values, and categorizes automatically.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Home className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Property Organization</CardTitle>
                <CardDescription>
                  Organize your assets by property and room for easy 
                  navigation and comprehensive coverage.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Insurance Reports</CardTitle>
                <CardDescription>
                  Generate professional, claim-ready reports with 
                  photos, values, and documentation in minutes.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Quick & Efficient</CardTitle>
                <CardDescription>
                  OCR processing in under 30 seconds, with page loads 
                  optimized for speed and efficiency.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Lock className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your data is protected with row-level security, 
                  signed URLs, and minimal PII storage.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Reliable Backup</CardTitle>
                <CardDescription>
                  Never lose your inventory data with automatic 
                  cloud backup and export capabilities.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl text-center">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of homeowners who trust CTRL Tech 
                to protect their most valuable assets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild size="lg" className="w-full">
                <Link to="/auth">
                  <Camera className="mr-2 h-5 w-5" />
                  Create Free Account
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                No credit card required. Start your inventory today.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
