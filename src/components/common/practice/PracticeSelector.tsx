'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';
import { usePractices } from '@/lib/react-query/hooks/use-practices';
import { Practice } from '@/services/practices';
import PracticeList from './PracticeList';
import PracticeDetails from './PracticeDetails';

interface PracticeSelectorProps {
  onStartPractice?: (practice: Practice) => void;
  lessonSlug?: string;
  lessonTitle?: string;
}

export default function PracticeSelector({ onStartPractice, lessonSlug, lessonTitle }: PracticeSelectorProps) {
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const { data: practicesData, isLoading } = usePractices({ 
    includeRelations: true,
    lessonSlug: lessonSlug || undefined,
    difficulty: typeof difficultyFilter === 'number' ? difficultyFilter : undefined
  });

  const practices = Array.isArray(practicesData) ? practicesData : (practicesData as { data: Practice[] })?.data || [];

  const filteredPractices = practices.filter((practice: Practice) =>
    practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    practice.scenario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPractice = (practice: Practice) => {
    setSelectedPractice(practice);
  };

  const handleStartPractice = () => {
    if (selectedPractice && onStartPractice) {
      onStartPractice(selectedPractice);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">
              {lessonTitle ? `Practice: ${lessonTitle}` : 'Choose Your Practice'}
            </CardTitle>
            <CardDescription>
              {lessonSlug 
                ? `Select a practice session for this lesson to improve your Git skills`
                : 'Select a practice session to improve your Git skills'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search practices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {}
              <Select value={difficultyFilter.toString()} onValueChange={(value) => 
                setDifficultyFilter(value === 'all' ? 'all' : parseInt(value))
              }>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="1">Beginner</SelectItem>
                  <SelectItem value="2">Intermediate</SelectItem>
                  <SelectItem value="3">Advanced</SelectItem>
                </SelectContent>
              </Select>

              {}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Available Practices</span>
                <Badge variant="secondary">
                  {filteredPractices.length} practices
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPractices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No practices found matching your criteria</p>
                </div>
              ) : (
                <PracticeList
                  practices={filteredPractices}
                  onSelectPractice={handleSelectPractice}
                  onStartPractice={onStartPractice}
                  selectedPracticeId={selectedPractice?.id}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {selectedPractice ? (
            <PracticeDetails
              practice={selectedPractice}
              onStartPractice={handleStartPractice}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a practice to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
