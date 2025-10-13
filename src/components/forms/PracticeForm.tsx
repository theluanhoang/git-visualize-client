'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { practiceSchema, PracticeFormData } from '@/lib/schemas/practice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, Lightbulb, Target, Terminal, CheckCircle, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PracticeFormProps {
  onSave: (practice: PracticeFormData) => void;
  onCancel: () => void;
  initialData?: Partial<PracticeFormData>;
}

export function PracticeForm({ onSave, onCancel, initialData }: PracticeFormProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'instructions' | 'commands' | 'hints' | 'validation' | 'tags'>('basic');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PracticeFormData>({
    resolver: zodResolver(practiceSchema),
    defaultValues: {
      title: initialData?.title || '',
      scenario: initialData?.scenario || '',
      difficulty: initialData?.difficulty ?? 1,
      estimatedTime: initialData?.estimatedTime ?? 0,
      isActive: initialData?.isActive ?? true,
      order: initialData?.order ?? 0,
      instructions: initialData?.instructions || [],
      hints: initialData?.hints || [],
      expectedCommands: initialData?.expectedCommands || [],
      validationRules: initialData?.validationRules || [],
      tags: initialData?.tags || []
    }
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions'
  });

  const { fields: hintFields, append: appendHint, remove: removeHint } = useFieldArray({
    control,
    name: 'hints'
  });

  const { fields: commandFields, append: appendCommand, remove: removeCommand } = useFieldArray({
    control,
    name: 'expectedCommands'
  });

  const { fields: validationFields, append: appendValidation, remove: removeValidation } = useFieldArray({
    control,
    name: 'validationRules'
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags'
  });

  const onSubmit = (data: PracticeFormData) => {
    onSave(data);
  };

  const addInstruction = () => {
    appendInstruction({ content: '', order: instructionFields.length + 1 });
  };

  const addHint = () => {
    appendHint({ content: '', order: hintFields.length + 1 });
  };

  const addCommand = () => {
    appendCommand({ command: '', order: commandFields.length + 1, isRequired: true });
  };

  const addValidation = () => {
    appendValidation({ type: 'min_commands', value: '', message: '' });
  };

  const addTag = () => {
    appendTag({ name: '', color: '#3B82F6' });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Target },
    { id: 'instructions', label: 'Instructions', icon: Target },
    { id: 'commands', label: 'Commands', icon: Terminal },
    { id: 'hints', label: 'Hints', icon: Lightbulb },
    { id: 'validation', label: 'Validation', icon: CheckCircle },
    { id: 'tags', label: 'Tags', icon: Tag }
  ];

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Practice Details</h2>
          <p className="text-sm text-muted-foreground">Configure the practice session</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Practice'}
          </Button>
        </div>
      </div>

      {}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Practice Title *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="e.g., Git Basics Practice"
                      className="mt-1"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="scenario">Scenario Description *</Label>
                    <Textarea
                      id="scenario"
                      {...register('scenario')}
                      placeholder="Describe what the user needs to accomplish..."
                      className="mt-1"
                      rows={3}
                    />
                    {errors.scenario && (
                      <p className="text-sm text-red-500 mt-1">{errors.scenario.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select
                        value={watch('difficulty')?.toString()}
                        onValueChange={(value) => setValue('difficulty', parseInt(value))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Beginner</SelectItem>
                          <SelectItem value="2">Intermediate</SelectItem>
                          <SelectItem value="3">Advanced</SelectItem>
                          <SelectItem value="4">Expert</SelectItem>
                          <SelectItem value="5">Master</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                      <Input
                        id="estimatedTime"
                        type="number"
                        {...register('estimatedTime', { valueAsNumber: true })}
                        placeholder="15"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      {...register('isActive')}
                      className="rounded"
                    />
                    <Label htmlFor="isActive">Active Practice</Label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Step-by-Step Instructions</CardTitle>
                  <Button onClick={addInstruction} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Instruction
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {instructionFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <Input
                          {...register(`instructions.${index}.content`)}
                          placeholder="Enter instruction step..."
                          className="mb-2"
                        />
                        {errors.instructions?.[index]?.content && (
                          <p className="text-sm text-red-500">
                            {errors.instructions[index]?.content?.message}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {instructionFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No instructions added yet</p>
                      <p className="text-sm">Click "Add Instruction" to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'commands' && (
            <motion.div
              key="commands"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Expected Commands</CardTitle>
                  <Button onClick={addCommand} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Command
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commandFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          {...register(`expectedCommands.${index}.command`)}
                          placeholder="e.g., git init"
                          className="font-mono"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register(`expectedCommands.${index}.isRequired`)}
                            className="rounded"
                          />
                          <Label className="text-sm">Required command</Label>
                        </div>
                        {errors.expectedCommands?.[index]?.command && (
                          <p className="text-sm text-red-500">
                            {errors.expectedCommands[index]?.command?.message}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCommand(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {commandFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No commands added yet</p>
                      <p className="text-sm">Click "Add Command" to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'hints' && (
            <motion.div
              key="hints"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Helpful Hints</CardTitle>
                  <Button onClick={addHint} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hint
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hintFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <Textarea
                          {...register(`hints.${index}.content`)}
                          placeholder="Enter helpful hint..."
                          rows={2}
                        />
                        {errors.hints?.[index]?.content && (
                          <p className="text-sm text-red-500">
                            {errors.hints[index]?.content?.message}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHint(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {hintFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hints added yet</p>
                      <p className="text-sm">Click "Add Hint" to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'validation' && (
            <motion.div
              key="validation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Validation Rules</CardTitle>
                  <Button onClick={addValidation} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {validationFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-sm">Type</Label>
                            <Select
                              value={watch(`validationRules.${index}.type`)}
                              onValueChange={(value) => setValue(`validationRules.${index}.type`, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="min_commands">Min Commands</SelectItem>
                                <SelectItem value="max_commands">Max Commands</SelectItem>
                                <SelectItem value="required_commands">Required Commands</SelectItem>
                                <SelectItem value="branch_count">Branch Count</SelectItem>
                                <SelectItem value="commit_count">Commit Count</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm">Value</Label>
                            <Input
                              {...register(`validationRules.${index}.value`)}
                              placeholder="e.g., 2"
                            />
                          </div>
                        </div>
                        <Input
                          {...register(`validationRules.${index}.message`)}
                          placeholder="Error message (optional)"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeValidation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {validationFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No validation rules added yet</p>
                      <p className="text-sm">Click "Add Rule" to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'tags' && (
            <motion.div
              key="tags"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tags</CardTitle>
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tagFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            {...register(`tags.${index}.name`)}
                            placeholder="e.g., beginner"
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              {...register(`tags.${index}.color`)}
                              placeholder="#3B82F6"
                              className="font-mono"
                            />
                            <div
                              className="w-8 h-8 rounded border"
                              style={{ backgroundColor: watch(`tags.${index}.color`) || '#3B82F6' }}
                            />
                          </div>
                        </div>
                        {errors.tags?.[index]?.name && (
                          <p className="text-sm text-red-500">
                            {errors.tags[index]?.name?.message}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {tagFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No tags added yet</p>
                      <p className="text-sm">Click "Add Tag" to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
