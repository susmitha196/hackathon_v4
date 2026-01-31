"""
ML Model for Downtime Prediction
Uses RandomForestClassifier to predict machine downtime risk
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

class DowntimePredictor:
    """Predict machine downtime risk using RandomForest"""
    
    def __init__(self):
        self.model = None
        self.feature_names = ['temperature', 'vibration', 'cycle_time', 'error_count']
        self.trained = False
    
    def generate_training_data(self, n_samples=1000):
        """Generate synthetic training data"""
        np.random.seed(42)
        
        # Normal operation data
        n_normal = n_samples // 2
        normal_data = {
            'temperature': np.random.normal(65, 5, n_normal),
            'vibration': np.random.normal(2.3, 0.5, n_normal),
            'cycle_time': np.random.normal(42.5, 2, n_normal),
            'error_count': np.random.poisson(0.5, n_normal)
        }
        
        # Risk operation data (failure scenarios)
        n_risk = n_samples - n_normal
        risk_data = {
            'temperature': np.random.normal(95, 10, n_risk),
            'vibration': np.random.normal(8, 3, n_risk),
            'cycle_time': np.random.normal(60, 8, n_risk),
            'error_count': np.random.poisson(10, n_risk)
        }
        
        # Combine data
        all_data = {
            'temperature': np.concatenate([normal_data['temperature'], risk_data['temperature']]),
            'vibration': np.concatenate([normal_data['vibration'], risk_data['vibration']]),
            'cycle_time': np.concatenate([normal_data['cycle_time'], risk_data['cycle_time']]),
            'error_count': np.concatenate([normal_data['error_count'], risk_data['error_count']]),
            'risk_label': np.concatenate([[0] * n_normal, [1] * n_risk])
        }
        
        df = pd.DataFrame(all_data)
        return df
    
    def train(self):
        """Train the RandomForest model"""
        # Generate training data
        df = self.generate_training_data(1000)
        
        # Prepare features and labels
        X = df[self.feature_names]
        y = df['risk_label']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
        self.model.fit(X_train, y_train)
        
        self.trained = True
        
        # Calculate accuracy
        accuracy = self.model.score(X_test, y_test)
        print(f"Model trained with {accuracy:.2%} accuracy")
    
    def predict_risk(self, sensor_data):
        """
        Predict downtime risk from sensor data
        
        Args:
            sensor_data: Dict with 'temperature', 'vibration', 'cycle_time', 'error_count'
            
        Returns:
            Dict with 'risk' (0-100) and 'feature_importance'
        """
        if not self.trained:
            self.train()
        
        # Prepare features
        features = np.array([[
            sensor_data.get('temperature', 65),
            sensor_data.get('vibration', 2.3),
            sensor_data.get('cycle_time', 42.5),
            sensor_data.get('error_count', 0)
        ]])
        
        # Predict probability
        proba = self.model.predict_proba(features)[0]
        risk_percentage = int(proba[1] * 100)  # Probability of risk class
        
        # Get feature importance
        importances = self.model.feature_importances_
        feature_importance = {
            'temperature': float(importances[0]),
            'vibration': float(importances[1]),
            'cycle_time': float(importances[2]),
            'error_count': float(importances[3])
        }
        
        return {
            'risk': risk_percentage,
            'feature_importance': feature_importance
        }

if __name__ == "__main__":
    # Test the model
    predictor = DowntimePredictor()
    predictor.train()
    
    # Test prediction
    test_data = {
        'temperature': 95.0,
        'vibration': 8.5,
        'cycle_time': 65.0,
        'error_count': 12
    }
    
    result = predictor.predict_risk(test_data)
    print(f"\nTest Prediction:")
    print(f"Risk: {result['risk']}%")
    print(f"Feature Importance: {result['feature_importance']}")
