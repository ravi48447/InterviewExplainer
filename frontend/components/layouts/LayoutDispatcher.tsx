/**
 * LayoutDispatcher
 *
 * Routes a question to the correct layout component based on `layoutType`.
 * Falls back gracefully — if layoutType is missing or unknown, returns null
 * so QuestionPageLayout falls back to its existing generic rendering.
 */
import type { QuestionPagePayload } from "@/lib/api";
import type { V2ExtendedFields } from "@/components/question/QuestionPageLayout";

import { ConceptExplainerLayout }    from "./ConceptExplainerLayout";
import { ComparisonArenaLayout }     from "./ComparisonArenaLayout";
import { InternalsDeepDiveLayout }   from "./InternalsDeepDiveLayout";
import { CodeWorkshopLayout }        from "./CodeWorkshopLayout";
import { ArchitectureMapLayout }     from "./ArchitectureMapLayout";
import { LifecycleTimelineLayout }   from "./LifecycleTimelineLayout";
import { RecipeBuilderLayout }       from "./RecipeBuilderLayout";
import { ProblemDetectiveLayout }    from "./ProblemDetectiveLayout";
import { ReferenceCardsLayout }      from "./ReferenceCardsLayout";
import { SqlPlaygroundLayout }       from "./SqlPlaygroundLayout";
import { FlowDiagramLayout }         from "./FlowDiagramLayout";
import { DesignWhiteboardLayout }    from "./DesignWhiteboardLayout";
import { AlgorithmWorkshopLayout }   from "./AlgorithmWorkshopLayout";

interface LayoutDispatcherProps {
  layoutType: string;
  data: QuestionPagePayload;
  v2?: V2ExtendedFields;
}

export function LayoutDispatcher({ layoutType, data, v2 }: LayoutDispatcherProps) {
  const sections  = data.answerSections ?? [];
  const title     = data.title;
  const question  = data.questionText ?? data.title;
  const direct    = v2?.directAnswer;
  const followups = v2?.followupQuestions;

  switch (layoutType) {
    case 'concept-explainer':
      return (
        <ConceptExplainerLayout
          title={title}
          questionText={question}
          sections={sections}
          directAnswer={direct}
          followupQuestions={followups}
        />
      );

    case 'comparison-arena':
      return (
        <ComparisonArenaLayout
          title={title}
          questionText={question}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'internals-deep-dive':
      return (
        <InternalsDeepDiveLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'code-workshop':
      return (
        <CodeWorkshopLayout
          title={title}
          sections={sections}
          directAnswer={direct}
          followupQuestions={followups}
        />
      );

    case 'architecture-map':
      return (
        <ArchitectureMapLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'lifecycle-timeline':
      return (
        <LifecycleTimelineLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'recipe-builder':
      return (
        <RecipeBuilderLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'problem-detective':
      return (
        <ProblemDetectiveLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'reference-cards':
      return (
        <ReferenceCardsLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'sql-playground':
      return (
        <SqlPlaygroundLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'flow-diagram':
      return (
        <FlowDiagramLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'design-whiteboard':
      return (
        <DesignWhiteboardLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    case 'algorithm-workshop':
      return (
        <AlgorithmWorkshopLayout
          title={title}
          sections={sections}
          directAnswer={direct}
        />
      );

    default:
      return null; // unknown layout → QuestionPageLayout uses its generic fallback
  }
}
