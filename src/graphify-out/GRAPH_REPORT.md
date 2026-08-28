# Graph Report - src  (2026-08-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 621 nodes · 1705 edges · 35 communities (33 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 1,256 input · 386 output

## Graph Freshness
- Built from commit: `eff0c997`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Admin Management UI
- Learner Progress Dashboard
- Accordion and Context Menu
- Chat and Notifications
- Course Learning Pathway
- Sidebar Layout Components
- App Routing and Auth
- Static Pages and Navigation
- Form Inputs and Links
- Alert Dialogs and Calendar
- Coding Practice Environment
- IGOT Integration Service
- AI Tutor Gemini Service
- Carousel Component
- Form Framework Components
- Data Visualization Charts
- Command Palette UI
- Database Schema Types
- Sheet Overlay Components
- Firebase Auth Context
- Breadcrumb Navigation
- Drawer Overlay Components
- Navigation Menu UI
- Admin Analytics Dashboard
- Error Boundary Handling
- Toggle Group Components
- Firebase Configuration
- Document Viewer Utility
- User Avatar Components
- PDF Download Hook

## God Nodes (most connected - your core abstractions)
1. `cn()` - 228 edges
2. `Button` - 43 edges
3. `Card` - 30 edges
4. `CardContent` - 30 edges
5. `CardHeader` - 29 edges
6. `CardTitle` - 29 edges
7. `CardDescription` - 26 edges
8. `Input` - 24 edges
9. `supabase` - 22 edges
10. `IGOTIntegrationService` - 21 edges

## Surprising Connections (you probably didn't know these)
- `CommandShortcut()` --calls--> `cn()`  [EXTRACTED]
  components/ui/command.tsx → lib/utils.ts
- `SheetFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts
- `SheetHeader()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts
- `NavLink` --calls--> `cn()`  [EXTRACTED]
  components/NavLink.tsx → lib/utils.ts
- `AlertDialogOverlay` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (35 total, 2 thin omitted)

### Community 0 - "Admin Management UI"
Cohesion: 0.08
Nodes (63): Admin, DepartmentManager(), Props, MigrationResult, MigrationTool(), Props, Props, Resource (+55 more)

### Community 1 - "Learner Progress Dashboard"
Cohesion: 0.06
Nodes (47): LearnerDashboard, MoSPIDatasets, CompetencyRadar(), CompetencyRadarProps, QuizTakerProps, RoleSelector(), RoleSelectorProps, Progress (+39 more)

### Community 2 - "Accordion and Context Menu"
Cohesion: 0.09
Nodes (37): AccordionContent, AccordionItem, AccordionTrigger, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem (+29 more)

### Community 3 - "Chat and Notifications"
Cohesion: 0.08
Nodes (33): ConversationHistory(), ConversationHistoryProps, streamChat(), StudyAssistant(), ScrollArea, ScrollBar, Toast, ToastAction (+25 more)

### Community 4 - "Course Learning Pathway"
Cohesion: 0.09
Nodes (29): LearningPathway, CourseCard(), CourseCardProps, Alert, AlertDescription, AlertTitle, alertVariants, DialogContent (+21 more)

### Community 5 - "Sidebar Layout Components"
Cohesion: 0.07
Nodes (30): Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent (+22 more)

### Community 6 - "App Routing and Auth"
Cohesion: 0.09
Nodes (18): AboutMission, App(), Auth, AuthCallback, Contact, DiagnosticAssessment, Landing, Login (+10 more)

### Community 7 - "Static Pages and Navigation"
Cohesion: 0.13
Nodes (12): About, Assignments, Index, Notes, PrivacyPolicy, PYQs, Resources, EduResources Logo (+4 more)

### Community 8 - "Form Inputs and Links"
Cohesion: 0.08
Nodes (15): NavLink, NavLinkCompatProps, Checkbox, HoverCardContent, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot (+7 more)

### Community 9 - "Alert Dialogs and Calendar"
Cohesion: 0.10
Nodes (20): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+12 more)

### Community 10 - "Coding Practice Environment"
Cohesion: 0.16
Nodes (12): PracticeDirectory, ProblemArena, CodeEditor(), CodeEditorProps, TabsContent, TabsList, TabsTrigger, codingQuestions (+4 more)

### Community 12 - "AI Tutor Gemini Service"
Cohesion: 0.18
Nodes (9): AITutor, GeminiService, sanitizePromptPII(), ChatSession, ExamTopic, Message, QuestionType, QuizQuestion (+1 more)

### Community 13 - "Carousel Component"
Cohesion: 0.19
Nodes (13): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+5 more)

### Community 14 - "Form Framework Components"
Cohesion: 0.23
Nodes (10): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+2 more)

### Community 15 - "Data Visualization Charts"
Cohesion: 0.25
Nodes (9): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, getPayloadConfigFromPayload(), THEMES (+1 more)

### Community 16 - "Command Palette UI"
Cohesion: 0.18
Nodes (9): Command, CommandDialogProps, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+1 more)

### Community 17 - "Database Schema Types"
Cohesion: 0.18
Nodes (10): CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables (+2 more)

### Community 18 - "Sheet Overlay Components"
Cohesion: 0.25
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 19 - "Firebase Auth Context"
Cohesion: 0.32
Nodes (6): Navbar(), AuthContext, AuthContextType, AuthProvider(), useFirebaseAuth(), auth

### Community 20 - "Breadcrumb Navigation"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 21 - "Drawer Overlay Components"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 22 - "Navigation Menu UI"
Cohesion: 0.29
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 23 - "Admin Analytics Dashboard"
Cohesion: 0.29
Nodes (5): AdminDashboard, effectivenessData, emergingSkillsData, forecastingData, gapData

### Community 24 - "Error Boundary Handling"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

### Community 25 - "Toggle Group Components"
Cohesion: 0.43
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 26 - "Firebase Configuration"
Cohesion: 0.29
Nodes (6): authObj, db, dbObj, firebaseConfig, storage, storageObj

### Community 27 - "Document Viewer Utility"
Cohesion: 0.67
Nodes (3): DocumentViewer(), DocumentViewerProps, isMobileDevice()

### Community 28 - "User Avatar Components"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

## Knowledge Gaps
- **109 isolated node(s):** `MigrationResult`, `Props`, `Resource`, `Props`, `UnsortedResource` (+104 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Accordion and Context Menu` to `Admin Management UI`, `Learner Progress Dashboard`, `Chat and Notifications`, `Course Learning Pathway`, `Sidebar Layout Components`, `Form Inputs and Links`, `Alert Dialogs and Calendar`, `Coding Practice Environment`, `Carousel Component`, `Form Framework Components`, `Data Visualization Charts`, `Command Palette UI`, `Sheet Overlay Components`, `Breadcrumb Navigation`, `Drawer Overlay Components`, `Navigation Menu UI`, `Toggle Group Components`, `User Avatar Components`?**
  _High betweenness centrality (0.486) - this node is a cross-community bridge._
- **Why does `Button` connect `Admin Management UI` to `Learner Progress Dashboard`, `Accordion and Context Menu`, `Chat and Notifications`, `Course Learning Pathway`, `Sidebar Layout Components`, `App Routing and Auth`, `Static Pages and Navigation`, `Alert Dialogs and Calendar`, `Coding Practice Environment`, `AI Tutor Gemini Service`, `Carousel Component`, `Firebase Auth Context`, `Admin Analytics Dashboard`, `Error Boundary Handling`, `Document Viewer Utility`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `IGOTIntegrationService` connect `IGOT Integration Service` to `Learner Progress Dashboard`, `Course Learning Pathway`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `MigrationResult`, `Props`, `Resource` to the rest of the system?**
  _109 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Management UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08483789555426131 - nodes in this community are weakly interconnected._
- **Should `Learner Progress Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.05711263881544157 - nodes in this community are weakly interconnected._
- **Should `Accordion and Context Menu` be split into smaller, more focused modules?**
  _Cohesion score 0.08710801393728224 - nodes in this community are weakly interconnected._