import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({ 
      ...req.body, 
      user: req.user._id 
    });

    // ✅ save workflowRunId
    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: { subscriptionId: subscription._id }
    });

    // ✅ send workflowRunId in response
    res.status(201).json({ 
      success: true, 
      data: {
        subscription,
        workflowRunId
      }
    });

  } catch (e) {
    next(e);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id) {  // ← also fixed condition!
            const error = new Error("You are not the owner of this account");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, subscriptions });

    } catch (e) {
        next(e);
    }
};

export const getSubscription = async (req, res, next) => {
  try {
    // 1. find by ID
    const subscription = await Subscription.findById(req.params.id);

    // 2. check if exists
    if(!subscription) {
      return res.status(404).json({ success: false, error: "Subscription not found" });
    }

    // 3. send response
    res.status(200).json({ success: true, subscription });

  } catch (e) {
    next(e);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    // 1. find and delete
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    // 2. check if exists
    if(!subscription) {
      return res.status(404).json({ success: false, error: "Subscription not found" });
    }

    // 3. send response
    res.status(200).json({ success: true, message: "Subscription deleted" });

  } catch (e) {
    next(e);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    // 1. find and update
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // 2. check if exists
    if(!subscription) {
      return res.status(404).json({ success: false, error: "Subscription not found" });
    }

    // 3. send response
    res.status(200).json({ success: true, subscription });

  } catch (e) {
    next(e);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ success: true, subscriptions });
  } catch (e) {
    next(e);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );

    if(!subscription) {
      return res.status(404).json({ 
        success: false, 
        error: "Subscription not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Subscription cancelled",
      subscription 
    });
  } catch (e) {
    next(e);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const subscriptions = await Subscription.find({
      user: req.user._id,
      renewalDate: { $gte: today, $lte: next30Days },
      status: 'Active'
    });

    res.status(200).json({ success: true, subscriptions });
  } catch (e) {
    next(e);
  }
};