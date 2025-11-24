# AutiCare - Adaptive Autism Support Platform

A comprehensive, role-based assessment and support platform for autism care, featuring adaptive UI, personalized scheduling, and evidence-based scoring.

## Features

### 🎯 Role-Based Assessments
- **Individual**: Self-assessment for adults and teens (15 questions)
- **Parent/Caregiver**: Child assessment with metadata collection (20 questions + family info)
- **Clinician**: Professional assessment with structured inputs and file uploads (coming soon)

### 📊 Intelligent Scoring System
- **Weighted Questions**: Social-communication (2.0x), Repetitive-sensory (1.5x), Developmental (2.5x)
- **Family History Bonus**: +6 points for genetic risk factors
- **Normalized Scoring**: 0-100 scale with severity thresholds:
  - **0-30 (Low)**: Monitor - Fresh mint theme
  - **31-55 (Mild)**: Consider screening - Bright blue theme
  - **56-75 (Moderate)**: Recommend evaluation - Lavender theme
  - **76-100 (High)**: Urgent assessment - Coral theme

### 🎨 Adaptive UI
The entire interface adapts in real-time based on assessment results:
- **Dynamic Colors**: UI accent colors change to match severity level
- **Schedule Complexity**: Task count and duration adjust automatically
  - Low: 2 tasks × 20-40 min (optional, gentle)
  - Mild: 3 tasks × 15-20 min (structured with timers)
  - Moderate: 5 tasks × 10-15 min (microtasks with breaks)
  - High: 7 tasks × 5-12 min (frequent breaks, clinician CTA)
- **Contextual Microcopy**: Messaging tone adapts to severity
- **Parent Support**: Role-specific tips for caregiver dashboards

### 🧘 Calm Zone
- Breathing animation (4-4-4 pattern)
- Ambient audio toggle
- Floating visual elements
- Positive affirmations
- Fully accessible design

### ♿ Accessibility Features
- **Text-to-Speech (TTS)**: Read questions aloud
- Large font toggle (coming soon)
- High contrast mode (coming soon)
- ARIA labels and semantic HTML
- Keyboard navigation support
- Touch-friendly UI (48px+ targets)

### 📄 Export & Documentation
- **PDF Summary Generation**: Download comprehensive assessment reports
- **Consent Timestamps**: Privacy-aware data handling
- **Top Contributors**: Displays 3 highest-weighted responses with actionable suggestions

### 🎭 Demo Mode
Three pre-configured scenarios for instant exploration:
1. **Low Severity** (Individual): Monitoring recommended
2. **Moderate Severity** (Parent): Clinical evaluation suggested  
3. **High Severity** (Parent): Urgent assessment needed

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **PDF Generation**: jsPDF
- **Build Tool**: Vite
- **Routing**: React Router v6

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd auticare

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── RoleSelection.tsx
│   ├── Questionnaire.tsx
│   ├── ResultModal.tsx
│   ├── Dashboard.tsx
│   └── CalmZone.tsx
├── data/
│   └── questionBanks.ts # All question content
├── utils/
│   └── scoring.ts       # Scoring logic
├── pages/
│   └── Index.tsx        # Main app orchestrator
└── index.css            # Design system tokens

Key files:
- tailwind.config.ts: Color system and animations
- index.css: HSL color definitions and semantic tokens
```

## Design System

### Color Palette (HSL)
```css
--bright-blue: 207 100% 59%    /* Primary CTA */
--coral: 0 100% 71%            /* Urgent/High severity */
--lavender: 250 100% 90%       /* Moderate severity */
--mint: 162 67% 68%            /* Low severity/Calm */
--foreground: 210 70% 15%      /* Deep text */
```

### Typography
- **Font**: Nunito (300, 400, 600, 700, 800 weights)
- **Headings**: Bold, 26-32px mobile, 40-60px desktop
- **Body**: 16-18px, line-height 1.6

### Animations
- `fade-in`: Entry animation (0.3s)
- `scale-in`: Modal appearances (0.3s)
- `breathe`: Calm Zone circle (4s loop)
- `float`: Background elements (3s loop)

## Scoring Formula

```javascript
// For each question:
value = answerMap[answer] // never=0, rarely=1, sometimes=2, often=3, always=4
contribution = value × weight

// Total calculation:
rawTotal = Σ(contribution) + familyHistoryBonus
maxPossible = Σ(4 × weight) + familyHistoryBonus
normalizedScore = round((rawTotal / maxPossible) × 100)
```

**Category Weights**:
- Social-communication: 2.0
- Repetitive-sensory: 1.5
- Developmental: 2.5
- Family history: 6.0 (binary flag)

## Future ML Integration

The codebase includes placeholders for machine learning endpoints:

```typescript
// TODO: Replace simulated scoring with ML API
// POST /api/analyze-questionnaire
// Body: { role, answers, metadata }
// Response: { score, confidence, recommendations }

// TODO: Video analysis endpoint
// POST /api/analyze-video
// Body: FormData with video file
// Response: { behavioralMarkers, timestamps, insights }
```

### Recommended ML Approach
1. Train multimodal model on validated ASD assessment data
2. Combine questionnaire responses with optional video analysis
3. Use explainable AI (SHAP/LIME) for transparency
4. Implement confidence thresholds for clinician review
5. Regular model retraining with clinical validation

## Changelog

### v1.0.0 - Initial Prototype
- ✅ Role-based questionnaire flows
- ✅ Weighted scoring algorithm
- ✅ Real-time UI adaptation
- ✅ Adaptive scheduling system
- ✅ Calm Zone with breathing exercises
- ✅ PDF export functionality
- ✅ Demo mode (3 scenarios)
- ✅ TTS accessibility
- ✅ Mobile-responsive design
- ✅ Parent metadata collection

### Planned Features (v2.0)
- [ ] Clinician assessment flow with file uploads
- [ ] Large font and high-contrast toggles
- [ ] Video upload and client-side preview
- [ ] Multi-language support
- [ ] Progress tracking over time
- [ ] Shareable clinician reports
- [ ] Real ML model integration
- [ ] Backend data persistence

## Privacy & Ethics

⚠️ **Important Notes**:
- This is a **supportive tool**, not a diagnostic instrument
- All data is currently client-side only (no backend storage)
- Designed to complement, not replace, professional clinical assessment
- Uses empathetic, non-stigmatizing language throughout
- Consent timestamps included in PDF exports
- No identifiable health information is transmitted

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

## Contributing

This is a prototype. For production use:
1. Add comprehensive unit/integration tests
2. Implement backend with HIPAA/GDPR compliance
3. Conduct clinical validation studies
4. Obtain appropriate medical device/software certifications
5. Partner with autism advocacy organizations for user testing

## License

This prototype is for demonstration purposes. Consult legal/medical experts before clinical deployment.

## Support

For questions about autism resources and professional support:
- Autism Society: [https://www.autism-society.org/](https://www.autism-society.org/)
- CDC Resources: [https://www.cdc.gov/ncbddd/autism/](https://www.cdc.gov/ncbddd/autism/)

---

**Built with ❤️ for the autism community. Always consult qualified healthcare professionals for medical advice.**
