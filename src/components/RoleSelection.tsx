import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Stethoscope } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: 'individual' | 'parent' | 'clinician') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-bright-blue to-mint bg-clip-text text-transparent">
            AutiCare
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Personalized support for autism care
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-bright-blue"
                onClick={() => onSelectRole('individual')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-bright-blue/10 flex items-center justify-center mb-4 group-hover:bg-bright-blue/20 transition-colors">
                <User className="w-10 h-10 text-bright-blue" />
              </div>
              <CardTitle className="text-2xl">Individual</CardTitle>
              <CardDescription className="text-base">
                For adults and teens who want to understand their own experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-bright-blue hover:bg-bright-blue/90 text-white"
                size="lg"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-mint"
                onClick={() => onSelectRole('parent')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-mint/10 flex items-center justify-center mb-4 group-hover:bg-mint/20 transition-colors">
                <Users className="w-10 h-10 text-mint" />
              </div>
              <CardTitle className="text-2xl">Parent/Caregiver</CardTitle>
              <CardDescription className="text-base">
                For parents and caregivers supporting a child's development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-mint hover:bg-mint/90 text-mint-foreground"
                size="lg"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-lavender"
                onClick={() => onSelectRole('clinician')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-lavender/20 flex items-center justify-center mb-4 group-hover:bg-lavender/30 transition-colors">
                <Stethoscope className="w-10 h-10 text-lavender-foreground" />
              </div>
              <CardTitle className="text-2xl">Clinician</CardTitle>
              <CardDescription className="text-base">
                For healthcare professionals conducting assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-lavender hover:bg-lavender/90 text-lavender-foreground"
                size="lg"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            AutiCare provides supportive tools and information. This is not a diagnostic tool.
            <br />
            Always consult with qualified healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
