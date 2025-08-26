#!/bin/bash
# SCK Policy LLM Fine-tuning Script

set -e

# Configuration
export MODEL_NAME="microsoft/DialoGPT-medium"  # Small model for testing
export TRAIN_FILE="../data/train_generated.jsonl"
export OUTPUT_DIR="../models/sck-policy-lora"
export EPOCHS=3
export BATCH_SIZE=4
export GRAD_ACC=8
export LR=3e-4

echo "🚀 SCK Policy LLM Fine-tuning"
echo "================================"
echo "Model: $MODEL_NAME"
echo "Training file: $TRAIN_FILE"
echo "Output dir: $OUTPUT_DIR"
echo "Epochs: $EPOCHS"
echo "Batch size: $BATCH_SIZE"
echo "Learning rate: $LR"
echo ""

# Check dependencies
echo "🔍 Checking dependencies..."
python -c "import transformers, peft, accelerate, bitsandbytes" || {
    echo "❌ Missing dependencies. Install with:"
    echo "pip install transformers peft accelerate bitsandbytes"
    exit 1
}

# Check CUDA
if command -v nvidia-smi &> /dev/null; then
    echo "✅ CUDA available:"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits
else
    echo "⚠️  CUDA not detected - training will be slow on CPU"
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Run fine-tuning
echo "🏋️ Starting fine-tuning..."
python finetune_peft.py \
    --model_name "$MODEL_NAME" \
    --train_file "$TRAIN_FILE" \
    --output_dir "$OUTPUT_DIR" \
    --epochs "$EPOCHS" \
    --batch_size "$BATCH_SIZE" \
    --lr "$LR" \
    --lora_r 8 \
    --lora_alpha 32 \
    --max_seq_length 1024

echo "✅ Fine-tuning complete!"
echo "📁 Model saved to: $OUTPUT_DIR"
echo "🎯 To use with Ollama, convert to GGUF format"
