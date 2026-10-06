const Class = require('../models/Class');

/**
 * @desc    Get all fitness classes (Supports basic sorting by date and category filter)
 * @route   GET /api/classes
 * @access  Public
 */
const getAllClasses = async (req, res, next) => {
  try {
    const { sort, category } = req.query;

    const queryObj = {};
    if (category) {
      queryObj.category = category;
    }

    // Sort by date: asc (default, ascending) or desc (descending)
    const sortOrder = sort === 'desc' ? -1 : 1;

    const classes = await Class.find(queryObj)
      .sort({ date: sortOrder })
      .populate('createdBy', 'name email role');

    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single fitness class by ID
 * @route   GET /api/classes/:id
 * @access  Public
 */
const getClassById = async (req, res, next) => {
  try {
    const fitnessClass = await Class.findById(req.params.id).populate(
      'createdBy',
      'name email role'
    );

    if (!fitnessClass) {
      return res.status(404).json({
        success: false,
        message: 'Fitness class not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: fitnessClass
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid fitness class ID format'
      });
    }
    next(error);
  }
};

/**
 * @desc    Create a new fitness class
 * @route   POST /api/classes
 * @access  Private (Studio role only)
 */
const createClass = async (req, res, next) => {
  try {
    const {
      title,
      description,
      instructor,
      category,
      date,
      startTime,
      endTime,
      capacity,
      imageUrl
    } = req.body;

    // 1. Validation
    if (!title || !instructor || !category || !date || !startTime || !endTime || capacity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, instructor, category, date, startTime, endTime, capacity'
      });
    }

    if (Number(capacity) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be at least 1'
      });
    }

    // 2. Create Fitness Class
    const newClass = await Class.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      instructor: instructor.trim(),
      category: category.trim(),
      date: new Date(date),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      capacity: Number(capacity),
      imageUrl: imageUrl || '',
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Fitness class created successfully',
      data: newClass
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * @desc    Update an existing fitness class
 * @route   PUT /api/classes/:id
 * @access  Private (Studio owner only)
 */
const updateClass = async (req, res, next) => {
  try {
    let fitnessClass = await Class.findById(req.params.id);

    if (!fitnessClass) {
      return res.status(404).json({
        success: false,
        message: 'Fitness class not found'
      });
    }

    // Authorization check: Only the studio user who created the class can update it
    if (fitnessClass.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this class (Only the class creator studio can perform updates)'
      });
    }

    // Perform Update
    fitnessClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email role');

    return res.status(200).json({
      success: true,
      message: 'Fitness class updated successfully',
      data: fitnessClass
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid fitness class ID format'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * @desc    Search fitness classes by keyword (title, description, instructor, category) & optional date filter
 * @route   GET /api/classes/search
 * @access  Public
 */
const searchClasses = async (req, res, next) => {
  try {
    const { keyword, date, startDate, fromDate, endDate, toDate } = req.query;

    const hasKeyword = keyword && typeof keyword === 'string' && keyword.trim().length > 0;
    const hasDate = Boolean(date || startDate || fromDate || endDate || toDate);

    // 1. Return 400 only if NEITHER keyword NOR date parameter is provided
    if (!hasKeyword && !hasDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid search keyword or date filter'
      });
    }

    const queryObj = {};

    // 2. Build keyword regex search if keyword is present
    if (hasKeyword) {
      const cleanKeyword = keyword.trim();
      const escapedKeyword = cleanKeyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const searchRegex = new RegExp(escapedKeyword, 'i');

      queryObj.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { instructor: { $regex: searchRegex } },
        { category: { $regex: searchRegex } }
      ];
    }

    // 3. Optional Date Filtering
    const startFilter = startDate || fromDate;
    const endFilter = endDate || toDate;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      if (!isNaN(startOfDay.getTime())) {
        queryObj.date = { $gte: startOfDay, $lte: endOfDay };
      }
    } else if (startFilter || endFilter) {
      queryObj.date = {};
      if (startFilter) {
        const start = new Date(startFilter);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          queryObj.date.$gte = start;
        }
      }
      if (endFilter) {
        const end = new Date(endFilter);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          queryObj.date.$lte = end;
        }
      }
    }

    // 4. Query DB and populate studio creator info
    const classes = await Class.find(queryObj)
      .sort({ date: 1 })
      .populate('createdBy', 'name email role');

    // 5. Return Clean JSON response (Empty array if no matches)
    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  searchClasses,
  createClass,
  updateClass
};

